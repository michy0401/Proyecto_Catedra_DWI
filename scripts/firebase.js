// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import { getFirestore, collection, addDoc, getDocs, getCountFromServer, deleteDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTZq8dpAaebEy_mbbuHWvGf-gwpwzH7yY",
  authDomain: "andianrestaurante.firebaseapp.com",
  projectId: "andianrestaurante",
  storageBucket: "andianrestaurante.firebasestorage.app",
  messagingSenderId: "613731572240",
  appId: "1:613731572240:web:b6adedee8c1b0e46b40895"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Exportar la referencia de Firestore para usarla en otros archivos
export { db };
