// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWHxRSWAx2CMwVgz1_GnrI71eDic8DGS8",
    authDomain: "schoolappbysk.firebaseapp.com",
    projectId: "schoolappbysk",
    storageBucket: "schoolappbysk.firebasestorage.app",
    messagingSenderId: "655486133956",
    appId: "1:655486133956:web:38bc7f462513d2035acb91",
    measurementId: "G-KH81R8R97D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
