// import { saveEmpleado, getEmpleados, getEmpleado, getEmpleadoListSize, deleteEmpleado, updateEmpleado } from "./firebase.js";
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDIlNIZN2sYQaw2xjsmw6XPylcXBpEbucw",
    authDomain: "desarrolloweb-17794.firebaseapp.com",
    projectId: "desarrolloweb-17794",
    storageBucket: "desarrolloweb-17794.firebasestorage.app",
    messagingSenderId: "932866256374",
    appId: "1:932866256374:web:b130f756bef8c596256bd7"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>

const formLogin = document.querySelector('#loginForm');
formLogin.addEventListener('submit', (event) => {
    event.preventDefault();
    const users = {
        admin: { password: 'admin123', role: 'admin' },
        empleado1: { password: 'empleado123', role: 'empleado' },
    };

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    message.textContent = "";

    if (users[username] && users[username].password === password) {
        const role = users[username].role;

        // Guardar datos en Firebase
        const dbRef = ref(database, 'users/' + username);
        set(dbRef, {
            username: username,
            role: role,
            lastLogin: new Date().toISOString()
        })
        .then(() => {
            console.log('Datos guardados en Firebase.');

            // Guardar datos en localStorage
            localStorage.setItem("userRole", role);
            localStorage.setItem("username", username);

            // Redirigir al inicio
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error al guardar en Firebase:", error);
        });
    } else {
        message.textContent = 'Usuario o contraseña incorrectos.';
        message.style.color = 'red';
    }
});