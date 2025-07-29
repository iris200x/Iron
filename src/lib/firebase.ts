import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDP7AMJ9_3Lf_BGYyXQWltJvCam9TL6ekA",
    authDomain: "iron-website-aa9fc.firebaseapp.com",
    projectId: "iron-website-aa9fc",
    storageBucket: "iron-website-aa9fc.firebasestorage.app",
    messagingSenderId: "23679354056",
    appId: "1:23679354056:web:23a58189c3b2fdbe2b11fd"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);