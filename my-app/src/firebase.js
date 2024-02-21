import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage";


//Exports Authentication and Firestore to the rest of the the project 
export const auth = firebase.auth();
export const firestore = firebase.firestore();


//Firebase configuration 
const firebaseConfig = {
  apiKey: "AIzaSyCxGAfivTx5MkI23kLvQMJrCL4CNYwew0Y",
  authDomain: "memory-lane-8d7b0.firebaseapp.com",
  projectId: "memory-lane-8d7b0",
  storageBucket: "memory-lane-8d7b0.appspot.com",
  messagingSenderId: "951803202921",
  appId: "1:951803202921:web:0a5e7c466706b1537301f8"
};  

//Initializes Firebase, Firestore, and Auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
