// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjZwGZJ-U_F3IeDxizRd1GoehthZ5Ng_s",
  authDomain: "miapp-integral-1.firebaseapp.com",
  projectId: "miapp-integral-1",
  storageBucket: "miapp-integral-1.firebasestorage.app",
  messagingSenderId: "247991717235",
  appId: "1:247991717235:web:61752ced0eff307edc8906",
  measurementId: "G-EPPY1WEBFX"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
