
const firebase = require(firebase);
const firebaseConfig = {
  apiKey: "AIzaSyCIpm0KrxwqHqCmFWE02kCy69C8N3gTY0I",
  authDomain: "hack-diversity---tech-dive.firebaseapp.com",
  projectId: "hack-diversity---tech-dive",
  storageBucket: "hack-diversity---tech-dive.appspot.com",
  messagingSenderId: "456551020980",
  appId: "1:456551020980:web:c35c421a2bd89c8a205ae1",
  measurementId: "G-7B4ZHSGWD4",
};

firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();
const Patients=db.collection("Patients"),

export default Patients;