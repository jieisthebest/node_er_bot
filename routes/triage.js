const express = require('express');
const router = express.Router();

const GENDER = ["Male", "Female", "Other"];
const SEVERITY = ["1", "2", "3"];

// display the triage form (GET)
router.get('/', (req, res) => {
    res.render('triage', { GENDER, SEVERITY });
});

// Handle patient creation (POST)
router.post('/', (req, res) => {
    //required variable for my form
    const { name, age, gender, symptom, severity } = req.body;
    if (!name || !age || !gender || !symptom || !severity) return res.redirect('/triage');

    //check if is digit
    const ageInt = parseInt(age, 10);
    if (isNaN(ageInt)) return res.status(400).render('error', { top: 400, bottom: "Invalid age" });

    const patientDb = req.app.locals.patientDb;
    const triageDb = req.app.locals.triageDb;

    const insertPatientSql = 'INSERT INTO patients (name, gender, age, date, patient_log) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)';
        patientDb.run(insertPatientSql,[name, gender, ageInt, symptom],function(err) 
        {
            if (err) {
                console.log("could not insert into database", err);
                return res.status(400).render('error', { top: 400, bottom: "Error" });
            }

            const patientId = this.lastID;

            // Split 
            const words = symptom.split(' ').filter(word=>word.trim().length>0);
            
            //eliminate empty query 
            if (words.length===0) {
                patientDb.run("INSERT INTO symptom_details (patient_id,symptom_id) VALUES (?,0)",[patientId],(err)=> {
                    if(err) {
                        console.error("Error no symptom found:",err.message);
                    }
                    return res.send(`
                       <script>
                            alert("No words found returning to triage. Your case logged as symptom_id= 0");
                            window.location.href='/triage';
                       </script>
                    `);  
                });
                return;
            }

            
            
            let results = [];
            let pending = words.length;

            // Iterate over each word to query the triage table
            words.forEach((word) => {
                triageDb.all("SELECT id FROM triage WHERE symptom LIKE ?", [`%${word}%`], (err, rows) => {
                    if (!err && rows) {
                        results.push(...rows);
                    }
                    pending--;

                    // Once all word searches are complete...
                    if (pending === 0) {
                        // Filter results to get only unique symptom IDs
                        const uniqueIds = [...new Set(results.map(r => r.id))];

                        // If no matches were found, insert a record with symptom_id 0
                        if (uniqueIds.length === 0) {
                            patientDb.run("INSERT INTO symptom_details (patient_id, symptom_id) VALUES (?, 0)", [patientId],(err)=> {
                            if (err) {
                                console.error("Error no symptom found:", err.message);
                            }  
                            return res.send(`<script>
                                                alert("No words found returning to triage. Your case logged as symptom_id= 0"); 
                                                window.location.href = '/triage';
                                            </script>`);
                            });
                            return;
                        } else {
                            // Insert each unique matching symptom_id into the symptom_details table
                            uniqueIds.forEach((id) => {
                                patientDb.run("INSERT INTO symptom_details (patient_id, symptom_id) VALUES (?, ?)", [patientId, id]);
                            });
                            return res.redirect(`/diagnosis?patient_id=${patientId}`);
                        }
                    }
                });
            });
        }
    );
});

module.exports = router;