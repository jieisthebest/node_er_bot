const express = require('express');
const path = require('path');

const app = express();

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Set up EJS for views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import routes
const triageRouter = require('./routes/triage');
const patientsRouter = require('./routes/patients'); // Read (View All Patients)
const updateRouter = require('./routes/update'); // Update Patient Data
const deleteRouter = require('./routes/delete'); // Delete Patient

// Use routes
app.use('/triage', triageRouter);  // Create
app.use('/patients', patientsRouter);  // Read
app.use('/update', updateRouter);  // Update
app.use('/delete', deleteRouter);  // Delete

// Home Route
app.get('/', (req, res) => {
    res.render('index');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));