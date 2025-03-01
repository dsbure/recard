// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhsA80iI8G-C5Oc5FFbhMAi2i-rSZxdhs",
  authDomain: "recallz.firebaseapp.com",
  projectId: "recallz",
  storageBucket: "recallz.firebasestorage.app",
  messagingSenderId: "251351125065",
  appId: "1:251351125065:web:2a62eae56a1cd38c638398",
  measurementId: "G-W1NGK6EZCR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);