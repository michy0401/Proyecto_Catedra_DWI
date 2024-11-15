// import { saveEmpleado, getEmpleados, getEmpleado, getEmpleadoListSize, deleteEmpleado, updateEmpleado } from "./firebase.js";

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

        // Guarda el rol y el nombre de usuario en localStorage
        localStorage.setItem("userRole", role);
        localStorage.setItem("username", username);

        // Redirige a la página de inicio (index.html)
        window.location.href = "index.html";
    } else {
        message.textContent = 'Usuario o contraseña incorrectos.';
        message.style.color = 'red';
    }
})