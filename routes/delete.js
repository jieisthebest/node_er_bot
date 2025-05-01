const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Connect to the database
const db = new sqlite3.Database('patient.db');

// Display delete confirmation page (GET request)
router.get('/:id', (req, res) => {
    const patientId = req.params.id;

    db.get("SELECT * FROM patients WHERE id=?", [patientId], (err, patient) => {
        if (!patient) return res.status(404).send("Patient Not Found");
        res.render('delete', { patient });
    });
});

// Handle patient deletion (POST request)
router.post('/:id', (req, res) => {
    const patientId = req.params.id;

    db.run("DELETE FROM patients WHERE id=?", [patientId], function (err) {
        if (err) return res.status(500).send("Database error");

        res.redirect('/patients'); // Redirect to patient list after deletion
    });
});

module.exports = router;