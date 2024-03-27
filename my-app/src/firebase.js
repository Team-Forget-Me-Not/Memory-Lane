// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxGAfivTx5MkI23kLvQMJrCL4CNYwew0Y",
  authDomain: "memory-lane-8d7b0.firebaseapp.com",
  databaseURL: "https://memory-lane-8d7b0-default-rtdb.firebaseio.com",
  projectId: "memory-lane-8d7b0",
  storageBucket: "memory-lane-8d7b0.appspot.com",
  messagingSenderId: "951803202921",
  appId: "1:951803202921:web:0a5e7c466706b1537301f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firebaseStorage = getStorage(app); // Initialize Firebase Storage
const firestore = getFirestore(app); // Initialize Firestore

export { auth, firebaseStorage, firestore };