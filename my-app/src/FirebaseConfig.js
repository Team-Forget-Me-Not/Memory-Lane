import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCxGAfivTx5MkI23kLvQMJrCL4CNYwew0Y",
    authDomain: "memory-lane-8d7b0.firebaseapp.com",
    databaseURL: "https://memory-lane-8d7b0-default-rtdb.firebaseio.com",
    projectId: "memory-lane-8d7b0",
    storageBucket: "memory-lane-8d7b0.appspot.com",
    messagingSenderId: "951803202921",
    appId: "1:951803202921:web:0a5e7c466706b1537301f8"
  };

  const app = initializeApp(firebaseConfig);
  export const database = getAuth(app);