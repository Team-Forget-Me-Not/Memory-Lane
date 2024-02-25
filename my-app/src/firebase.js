import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { auth as firebaseuiAuth } from 'firebaseui';




//Firebase configuration 
const firebaseConfig = {
  apiKey: "AIzaSyCxGAfivTx5MkI23kLvQMJrCL4CNYwew0Y",
  authDomain: "memory-lane-8d7b0.firebaseapp.com",
  projectId: "memory-lane-8d7b0",
  storageBucket: "memory-lane-8d7b0.appspot.com",
  messagingSenderId: "951803202921",
  appId: "1:951803202921:web:0a5e7c466706b1537301f8"
};  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // This is the correct declaration
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize FirebaseUI
const ui = new firebaseuiAuth.AuthUI(auth);

// Export the initialized services
export { app, auth, db, storage, ui };