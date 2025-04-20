// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./republic-of-beans-firebase-adminsdk-fbsvc-db6369792e.json'); // download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = db;
