const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('patient.db');

router.get('/', (req, res) => {
    const patientId = req.query.patient_id;

    db.get("SELECT * FROM patients WHERE id=?", [patientId], (err, patient) => {
        if (!patient) return res.status(400).send("Patient Not Found");

        db.all("SELECT symptom_id FROM symptom_details WHERE patient_id=?", [patientId], (err, symptomDetails) => {
            const symptomIds = symptomDetails.map(r => r.symptom_id);
            if (symptomIds.length > 0) {
                const query = `SELECT * FROM triage WHERE id IN (${symptomIds.map(() => '?').join(', ')})`;
                db.all(query, symptomIds, (err, diagnosis) => {
                    res.json({ patient, diagnosis });
                });
            } else {
                res.json({ patient, diagnosis: [] });
            }
        });
    });
});

module.exports = router;