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

// Routes
app.get("/", (req, res) => {
    return res.status(200).send(Success);
});

//Create - post()
 
//Get - get()

//Update - put()

//Delete -> delete()

//export the api to firebase cloud functions
exports.app = functions.https.onRequest(app);