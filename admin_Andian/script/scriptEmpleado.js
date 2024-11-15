import { saveEmpleado, getEmpleados, getEmpleado, getEmpleadoListSize, deleteEmpleado, updateEmpleado } from "./firebase.js";

if(localStorage.getItem("userRole") && localStorage.getItem("userRole") === 'empleado'){
    const navItem = document.getElementById('nav-item-employee');
    navItem.style.display = 'none'
    const dashboardEmployee = document.getElementById('dashboard-employee');
    if(dashboardEmployee){

        dashboardEmployee.style.display = 'none'
    }
}

const logoutBtn = document.querySelector('#logout-btn');
logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html'
})