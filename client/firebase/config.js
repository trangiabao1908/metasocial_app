// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHSPKO-18RIU32gKdIgMfbKUWr-kTAYNQ",
  authDomain: "meta-social-app-db279.firebaseapp.com",
  projectId: "meta-social-app-db279",
  storageBucket: "meta-social-app-db279.appspot.com",
  messagingSenderId: "523054419262",
  appId: "1:523054419262:web:f151e494c39af4a553306f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
