import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, getDoc, doc } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEHJ21Y-IbtfiXQdT6mN1W81-GyCtNo6E",
  authDomain: "freshbox-appmovil.firebaseapp.com",
  projectId: "freshbox-appmovil",
  storageBucket: "freshbox-appmovil.firebasestorage.app",
  messagingSenderId: "97137554217",
  appId: "1:97137554217:web:45e1256e19ae76e9ee3d38",
  measurementId: "G-8XFBGZJYZD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider, collection, addDoc, getDocs, query, where, getDoc, doc, signInWithPopup };

