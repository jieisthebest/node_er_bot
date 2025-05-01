const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Database connection function
function getDb(dbFile) {
    return new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
        if (err) console.error(err.message);
    });
}

// Middleware for database access
router.use((req, res, next) => {
    res.locals.triageDb = getDb('triage.db');
    res.locals.patientDb = getDb('patient.db');
    next();
});

// Display the triage form (GET request)
router.get('/', (req, res) => {
    const GENDER = ["Male", "Female", "Other"];
    const SEVERITY = ["1", "2", "3"];
    res.render('triage', { GENDER, SEVERITY });
});

// Handle patient creation (POST request)
router.post('/', (req, res) => {
    const { name, age, gender, symptom, severity } = req.body;
    if (!name || !age || !gender || !symptom || !severity) return res.redirect('/triage');

    const ageInt = parseInt(age, 10);
    if (isNaN(ageInt)) return res.status(400).render('error', { top: 400, bottom: "Invalid Data" });

    const db = res.locals.patientDb;
    db.run(
        "INSERT INTO patients (name, gender, age, date, patient_log) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)",
        [name, gender, ageInt, symptom],
        function (err) {
            if (err) return res.status(400).render('error', { top: 400, bottom: "Error" });

            const patientId = this.lastID;

            const triageDb = res.locals.triageDb;
            triageDb.all("SELECT id FROM triage WHERE symptom LIKE ?", [`%${symptom}%`], (err, results) => {
                if (err || results.length === 0) {
                    db.run("INSERT INTO symptom_details (patient_id, symptom_id) VALUES (?, 0)", [patientId]);
                    return res.redirect('/');
                }

                results.forEach(({ id }) => {
                    db.run("INSERT INTO symptom_details (patient_id, symptom_id) VALUES (?, ?)", [patientId, id]);
                });

                res.redirect(`/diagnosis?patient_id=${patientId}`);
            });
        }
    );
});

module.exports = router;