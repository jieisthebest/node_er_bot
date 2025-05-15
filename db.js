const sqlite3 = require('sqlite3').verbose();

const triageDb = new sqlite3.Database(
    'triage.db',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if(err) {
            console.error("triage.db unable to open or creating:", err.message);
        } else {
            console.log("triage.db connected");
            triageDb.run(`
        CREATE TABLE IF NOT EXISTS triage (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          symptom TEXT,
          location TEXT,
          severity INTEGER,
          er_visit_required BOOLEAN
        )
      `,(err)=> {
        if(err) {
            console.error("Error creating triage:",err.message);
        } else {
            console.log("triage table created");
        }
      });
        }
    }
);



const patientDb = new sqlite3.Database(
    'patient.db',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if(err) {
            console.error("patient.db unable to open or creating:", err.message);
        } else {
            console.log("patient.db connected");
    patientDb.run(`
        CREATE TABLE IF NOT EXISTS patients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          gender TEXT NOT NULL,
          age INTEGER,
          date DATETIME,
          patient_log TEXT NOT NULL
        )
      `,(err) => {
        if(err) {
            console.error("Error creating patient table:",err.message);
        }else {
            console.log("Patient table ready");
        }  
    });
    patientDb.run(`
        CREATE TABLE IF NOT EXISTS symptom_details (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_id INTEGER NOT NULL,
          symptom_id INTEGER NOT NULL,
          FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
      `,(err) => {
        if(err) {
            console.error("error creating symptom_detail table:", err.message);
        } else {
            console.log("symptom table ready");
        }
      });
    }
}
);



//database function retriever
function getDb(filename) {
    if (filename === 'triage.db') {
        return triageDb;
    } else if (filename==='patient.db') {
        return patientDb;
    } else {
        throw new Error(`NO db found for: ${filename}`);
    }
}

//join table for symptom_id matcher
function patientSymptomId(callback){
    const sqlQuery = `SELECT p.id,p.name,p.gender,p.age,p.date,p.patient_log,
    GROUP_CONCAT(sd.symptom_id,',') AS symptom_ids
    FROM patients p
    LEFT JOIN symptom_details sd ON p.id = sd.patient_id
    GROUP BY p.id`;
    patientDb.all(sqlQuery,callback);
}


    
    
    
    
module.exports = {
        triageDb,
        patientDb,
        getDb,
        patientSymptomId
};
