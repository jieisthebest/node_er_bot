const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Connect to the database
const db = new sqlite3.Database('patient.db');

// Read (GET) - View all patients
router.get('/', (req, res) => {
    db.all("SELECT * FROM patients", (err, rows) => {
        if (err) return res.status(500).send("Database error");
        res.render('patients', { patients: rows }); // Render EJS template
    });
});

module.exports = router;