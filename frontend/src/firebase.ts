import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPywsXDvYZLLEjQI_N39eQ3J3WltlIZ3U",
  authDomain: "ai-powered-chat-interface.firebaseapp.com",
  projectId: "ai-powered-chat-interface",
  storageBucket: "ai-powered-chat-interface.firebasestorage.app",
  messagingSenderId: "440778445870",
  appId: "1:440778445870:web:4875924e840b2819093bbf",
  measurementId: "G-9YP6JCC96Q",
  databaseURL: "https://ai-powered-chat-interface-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
