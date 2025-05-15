const express = require('express');
const router = express.Router();

//get:show me all the patients
router.get('/',(req,res)=> {
    const patientDb = req.app.locals.patientDb;
    patientDb.all("SELECT * FROM patients",(err,rows)=>{
        if (err) return res.status(500).send("Database error");
        res.render('update',{patients:rows});
    });
});

//post: 
router.post('/edit/:id',(req,res) => {
    const patientId = req.params.id;
    const { name,gender,age}= req.body;
    const patientDb = req.app.locals.patientDb;
    const updateQuery = "UPDATE patients SET name = ?, gender = ?, age = ? WHERE id = ?";
    patientDb.run(updateQuery,[name,gender,age,patientId], function(err){
        if(err) {
            console.error("error updating:",err.message);
            return res.status(400).send("error updating records");
        }
        res.redirect('/update');
    });
});

module.exports = router;
