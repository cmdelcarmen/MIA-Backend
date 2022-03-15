const functions = require("firebase-functions");

const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const express = require("express");

const cors = require("cors");
const { ref } = require("firebase-functions/v1/database");

// Main app
const app = express();
app.use(cors({ origin: true }));

// Main databse reference
const db = admin.firestore();

// Routes
app.get("/", (req, res) => {
    return res.status(200).send("Success");
});

//Create - post()
app.post("/api/create", (req, res) => {
    (async () => {
        try{
            await db.collection('Patients').doc("COVID-19-AR-16406" + "EXAMPLE_CREATE").create({
                bmi : req.body.bmi,
                dob : req.body.dob,
                firstName : req.body.firstName,
                height : req.body.height,
                icuAdmit : req.body.icuAdmit,
                lastName :  req.body.lastName,
                race : req.body.race,
                sex : req.body.sex,
                weight : req.body.weight,
                zip : req.body.zip
            });
            return res.status(200).send({ status : 'Success', msg : 'Data Saved' });
        } catch(error) {
            console.log(error);
            return res.status(500).send({ status : 'Failed', msg : error });
        }
    })();
}); 

// Get - get()
// Fetch - Single Data form firestore using specific ID
app.get('/api/get/:id', (req, res) => {
    (async () => {
        try {
            const reqDoc = db.collection('Patients').doc(req.params.id);
            let patient = await reqDoc.get();
            let response = patient.data();

            return res.status(200).send({ status: "Success", data: response });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ status: "Failed", msg: error });
        }
    })();
});


app.delete('/api/delete/:id', (req, res) => {
    (async () => {
        try {
            const { id } = req.params;
            console.log(id)
            // Collection has space in front of name in Firebase
            const patientsCollection = db.collection('Patients').doc(id);
            const imagesCollection = db.collection('images ').doc(id);
            const userExamCollections = await imagesCollection.listCollections();

            for await (const exam of userExamCollections) {
                let snapshot = await exam.get();
                snapshot.forEach(async (document) => {
                    await document.ref.delete();
                });
            };
            imagesCollection.delete();
            patientsCollection.delete();
            console.log("we are hitting the console log statement");
         

            return res.status(200).send({ status: "Success", });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ status: "Failed", msg: error });
        }
    })();
});

app.delete('/api/delete/images/:id/:exa', (req, res) => {
    (async () => {
        try {
            const { id } = req.params;
            const { exa } = req.params;
            console.log(id)
            // Collection has space in front of name in Firebase
            const imagesCollection = db.collection('images ').doc(id);
            const userExamCollections = await imagesCollection.collection('exams').doc(exa);

            
                userExamCollections.ref.delete();
                
            
        
            console.log("we are hitting the console log statement");
         

            return res.status(200).send({ status: "Success", });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ status: "Failed", msg: error });
        }
    })();
});


app.get('/api/get/images/:id', (req, res) => {
    (async () => {
        try {
            const { id } = req.params;
            // Collection has space in front of name in Firebase
            const imagesCollection = db.collection('images ').doc(id);
            const userExamColletions = await imagesCollection.listCollections();

           let links = {};
            links[id] = [];

            for await (const exam of userExamColletions) {
                let snapshot = await exam.get();
                snapshot.forEach(async (document) => {
                    let doc = document.data();
                    links[id].push(doc.link);
                });
            } 


           

            return res.status(200).send({ status: "Success", data: links });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ status: "Failed", msg: error });
        }
    })();
});
//Update - put()

//Delete -> delete()

//export the api to firebase cloud functions
exports.app = functions.https.onRequest(app);
