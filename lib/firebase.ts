import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase app using env vars. Ensure these are set in your .env
const firebaseConfig = {
    apiKey: "AIzaSyAMi85qRQSDrqhlxc-l4UYkegcRxa_FD7g",
    authDomain: "ghig-1a4f1.firebaseapp.com",
    projectId: "ghig-1a4f1",
    storageBucket: "ghig-1a4f1.firebasestorage.app",
    messagingSenderId: "412743227043",
    appId: "1:412743227043:web:5a99ae33d78b8521655116",
};

if (!getApps().length) {
  initializeApp(firebaseConfig as any);
}

export const db = getFirestore();
