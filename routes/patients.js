const express = require('express');
const router = express.Router();
const { patientSymptomId, patientDb } = require('../db');

// view all patients via
router.get('/', (req, res) => {
    patientSymptomId((err, rows) => {
        if (err) return res.status(500).send("Database error");

//attaching database
patientDb.run("ATTACH DATABASE './triage.db' AS triagedb", (attachErr) => {
      if (attachErr) {
        console.error("Error attaching triage.db:", attachErr.message);
        return res.status(500).send("Database attachment error");
      }

        //new join query
        const symptomQuery = `
  SELECT sd.patient_id, sd.symptom_id, t.symptom, t.location, t.severity, t.er_visit_required
  FROM symptom_details sd 
  JOIN triagedb.triage t ON sd.symptom_id = t.id
`;

        patientDb.all(symptomQuery, (err2,symptoms)=>{
            if(err2)return res.status(500).send("database join error");
            res.render('patients', { patients: rows,symptoms:symptoms }); // Render EJS template
    });
});
});
});
module.exports = router;