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


//inicializando el trabajo con la db de firestore
const db=getFirestore();


//METODOS PARA MENU

// Guardar un platillo en la colección 'menu'
export const savePlatillo = (platillo) => {
  addDoc(collection(db, 'menu'), platillo);
}

// Obtener todos los productos de la colección 'menu'
export const getPlatillos = () => getDocs(collection(db, 'menu'));

// Obtener un producto específico de la colección 'menu' por su ID
export const getPlatillo = (id) => getDoc(doc(db, 'menu', id));

// Obtener el tamaño de la lista de productos en la colección 'menu'
export const gePlatilloListSize = async () => {
  const menu = collection(db, "menu");
  const snapshot = await getCountFromServer(menu);
  return snapshot.data().count;
}

// Eliminar un producto de la colección 'menu' por su ID
export const deletePlatillo = (id) => deleteDoc(doc(db, 'menu', id));

// Actualizar un producto específico en la colección 'menu' por su ID
export const updatePlatillo = (id, newFields) => updateDoc(doc(db, 'menu', id), newFields);


//METODOS PARA EMPLEADO
// Guardar un empleado en la colección 'empleado'
export const saveEmpleado = (empleado) => {
  addDoc(collection(db, 'empleado'), empleado);
}

// Obtener todos los empleados de la colección 'empleado'
export const getEmpleados = () => getDocs(collection(db, 'empleado'));

// Obtener un empleado específico de la colección 'empleado' por su ID
export const getEmpleado = (id) => getDoc(doc(db, 'empleado', id));

// Obtener el tamaño de la lista de empleados en la colección 'empleado'
export const getEmpleadoListSize = async () => {
  const empleados = collection(db, "empleado");
  const snapshot = await getCountFromServer(empleados);
  return snapshot.data().count;
}

// Eliminar un empleado de la colección 'empleado' por su ID
export const deleteEmpleado = (id) => deleteDoc(doc(db, 'empleado', id));

// Actualizar un empleado específico en la colección 'empleado' por su ID
export const updateEmpleado = (id, newFields) => updateDoc(doc(db, 'empleado', id), newFields);

//METODOS PARA PROMOCIONES
// Guardar una promoción en la colección 'promocion'
export const savePromocion = (promocion) => {
  addDoc(collection(db, 'promocion'), promocion);
}

// Obtener todas las promociones de la colección 'promocion'
export const getPromociones = () => getDocs(collection(db, 'promocion'));

// Obtener una promoción específica de la colección 'promocion' por su ID
export const getPromocion = (id) => getDoc(doc(db, 'promocion', id));

// Obtener el tamaño de la lista de promociones en la colección 'promocion'
export const getPromocionListSize = async () => {
  const promociones = collection(db, "promocion");
  const snapshot = await getCountFromServer(promociones);
  return snapshot.data().count;
}

// Eliminar una promoción de la colección 'promocion' por su ID
export const deletePromocion = (id) => deleteDoc(doc(db, 'promocion', id));

// Actualizar una promoción específica en la colección 'promocion' por su ID
export const updatePromocion = (id, newFields) => updateDoc(doc(db, 'promocion', id), newFields);

