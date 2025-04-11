// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_nvwQ1QPW_qQ9jPH3MjoRKl3NDVf2HSM",
  authDomain: "projectverse-b8856.firebaseapp.com",
  projectId: "projectverse-b8856",
  storageBucket: "projectverse-b8856.firebasestorage.app",
  messagingSenderId: "1065787835635",
  appId: "1:1065787835635:web:c1ce516ae413526263a386",
  measurementId: "G-FM5630ZTX2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Get the Firebase ID token
    const token = await result.user.getIdToken();
    return { token, user: result.user };
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};
