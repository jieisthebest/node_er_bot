const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Connect to the database
const db = new sqlite3.Database('patient.db');

// Display the update form (GET request)
router.get('/:id', (req, res) => {
    const patientId = req.params.id;

    db.get("SELECT * FROM patients WHERE id=?", [patientId], (err, patient) => {
        if (!patient) return res.status(404).send("Patient Not Found");
        res.render('update', { patient });
    });
});

// Handle patient update (POST request)
router.post('/:id', (req, res) => {
    const { name, gender, age, patient_log } = req.body;
    const patientId = req.params.id;

    db.run("UPDATE patients SET name=?, gender=?, age=?, patient_log=? WHERE id=?", 
        [name, gender, age, patient_log, patientId], function (err) {
        if (err) return res.status(500).send("Database error");
        
        res.redirect('/patients'); // Redirect to patients list after updating
    });
});

module.exports = router;
