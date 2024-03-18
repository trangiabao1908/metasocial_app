// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_bd0Gz8M0mTL1EU6VcC7G2LYonGR4XNw",
  authDomain: "meta-social-app-910b3.firebaseapp.com",
  projectId: "meta-social-app-910b3",
  storageBucket: "meta-social-app-910b3.appspot.com",
  messagingSenderId: "251493867177",
  appId: "1:251493867177:web:8c109d9427d6abcf1813b8",
  measurementId: "G-B47687Q8HZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
