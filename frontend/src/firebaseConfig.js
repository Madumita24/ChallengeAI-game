// frontend/src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAaAvl1vnW1MmpDn6XfSlrCqMswkaxWIro",
  authDomain: "republic-of-beans.firebaseapp.com",
  projectId: "republic-of-beans",
  storageBucket: "republic-of-beans.firebasestorage.app",
  messagingSenderId: "764049590103",
  appId: "1:764049590103:web:99595243cf054ce71c6012",
  measurementId: "G-RHZDCPQ8PP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db }; // 👈 export both so you can use `app` in PhaseThree
