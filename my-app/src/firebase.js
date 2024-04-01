import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // Import the authentication module 
import 'firebase/firestore';

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
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const firebaseStorage = getStorage(app); // Initialize Firebase Storage
// const firestore = getFirestore(app); // Initialize Firestore

// export { auth, firebaseStorage, firestore };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;