const express = require('express');
const router = express.Router();

//show all the patients
router.get('/',(req,res)=> {
    const patientDb = req.app.locals.patientDb;
    patientDb.all("SELECT * FROM patients", (err,rows)=>{
        if (err) return res.status(500).send("database error");
        res.render('delete',{patients:rows});
    });
});

//delete
router.post('/:id',(req,res)=> {
    const patientId = req.params.id;
    const patientDb = req.app.locals.patientDb;
    patientDb.run("DELETE FROM patients WHERE id=?", [patientId], (err) => {
        if (err) return res.status(400).send("could not delete");
        res.redirect('/delete');
    });
});

module.exports = router;