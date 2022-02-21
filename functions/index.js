const functions = require("firebase-functions");

const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const express = require("express");

const cors = require("cors");

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

// Update - put()
app.put('/api/update/:id', async (req, res, next) => {
    const reqDoc = await db.collection('Patients').doc(req.params.id);
    console.log(reqDoc);
    
    if(reqDoc){
        await reqDoc.update({
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
        res.status(200).send({ status: "Success", data: res });
    } else {
        res.status(404).send({ status: "Failed", msg: error });
    }
}
);

//Delete -> delete()

//export the api to firebase cloud functions
exports.app = functions.https.onRequest(app);
