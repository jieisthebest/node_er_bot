const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //get the patient id
    const patientId = req.query.patient_id;
    //if cannot get patient id
    if (!patientId) {
        return res.status(400).render('error',{top:400, bottom:"patient id not found"});
    }

    //db connections
    const patientDb = req.app.locals.patientDb;
    const triageDb = req.app.locals.triageDb;

    //get all matching items from patient id
    patientDb.get("SELECT * FROM patients WHERE id=?", [patientId], (err, patient) => {
        //if error 400 could not get patient
        if (err||!patient) {
            return res.status(400).send("Patient Not Found");
        }
        //display all patient symptoms
        patientDb.all("SELECT symptom_id FROM symptom_details WHERE patient_id=?", [patientId], (err, symptomDetails) => {
            if (err) {
                return res.status(400).send("Error getting symptom details");
            }
            const symptomIds = symptomDetails.map(r => r.symptom_id);
            //if number of symptoms is greater than 0
            if (symptomIds.length > 0) {
                const query = `SELECT * FROM triage WHERE id IN (${symptomIds.map(() => '?').join(', ')})`;
                triageDb.all(query, symptomIds, (err, diagnosis) => {
                if(err){
                    return res.status(400).send("error fetching diagnosis from triage table ")
                }
                    res.render('diagnosis', { patient, results: diagnosis });
                });
            } else {  
                //else just return empty table as it is
                res.render('diagnosis', { patient, results: [] });
            }
        });
    });
});

module.exports = router;