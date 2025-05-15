const express = require('express');
const path = require('path');
const app = express();
const { getDb } = require('./db');

// middleware 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// ejs 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//db connection
app.locals.patientDb = getDb('patient.db');
app.locals.triageDb = getDb('triage.db');

// routes
const triageRouter = require('./routes/triage');  
const patientsRouter = require('./routes/patients'); 
const updateRouter = require('./routes/update'); 
const deleteRouter = require('./routes/delete'); 
const diagnosisRouter = require('./routes/diagnosis');

// CRUD routes

app.use('/triage', triageRouter);  // create
app.use('/patients', patientsRouter);  // read
app.use('/update', updateRouter);  // update
app.use('/delete', deleteRouter);  // delete
app.use('/diagnosis', diagnosisRouter); //diagnosis

// index Route
app.get('/', (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));