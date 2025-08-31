// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAH40HsWYJb1l0ZqQKxvNpShy1rkKIPj2I",
  authDomain: "urban-733ce.firebaseapp.com",
  projectId: "urban-733ce",
  storageBucket: "urban-733ce.firebasestorage.app",
  messagingSenderId: "488143118292",
  appId: "1:488143118292:web:84b00b63f32abdc6764041",
  measurementId: "G-C244Z9QQ2M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
