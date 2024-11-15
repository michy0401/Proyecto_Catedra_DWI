// Importar Firestore desde firebase.js
import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Función para renderizar el menú
const renderMenu = async () => {
  try {
    // Consulta de la colección "menu" filtrando por categoría "desayuno"
    const menuQuery = query(collection(db, "menu"), where("categoria", "==", "Postre"));
    
    const querySnapshot = await getDocs(menuQuery);  // Obtener los documentos filtrados
    const dishContainer = document.querySelector(".dish-container"); // Contenedor donde se renderizan los platillos

    // Limpiar el contenedor antes de agregar nuevos elementos
    dishContainer.innerHTML = '';

    // Iterar a través de los documentos y renderizar cada platillo
    querySnapshot.forEach((doc) => {
      const data = doc.data();  // Obtener los datos del documento
      const dishCard = `
        <div class="dish-card">
          <img src="${data.imagen}" alt="${data.platillo}">
          <h2>${data.platillo}</h2>
          <p class="dish-description">${data.descripcion}</p>
          <p class="dish-price">$${parseFloat(data.precio).toFixed(2)}</p>
        </div>
      `;
      dishContainer.innerHTML += dishCard;  // Agregar la tarjeta al contenedor
    });
  } catch (error) {
    console.error("Error al obtener los datos: ", error);  // Capturar errores si los hay
  }
};

// Llamar la función para renderizar el menú cuando se cargue el archivo
renderMenu();

