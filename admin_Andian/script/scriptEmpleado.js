import {
    saveEmpleado,
    getEmpleados,
    getEmpleado,
    deleteEmpleado,
    updateEmpleado
} from './firebase.js';

// Verificar el rol del usuario en localStorage y ocultar elementos de la interfaz si es necesario
if (localStorage.getItem("userRole") && localStorage.getItem("userRole") === 'empleado') {
    const navItem = document.getElementById('nav-item-employee');
    if (navItem) {
        navItem.style.display = 'none';
    }
    
    const dashboardEmployee = document.getElementById('dashboard-employee');
    if (dashboardEmployee) {
        dashboardEmployee.style.display = 'none';
    }
}

// Manejo del botón de cierre de sesión
const logoutBtn = document.querySelector('#logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
}

const empleadoTableBody = document.querySelector("#example1 tbody");

async function renderEmpleados() {
    try {
        const empleadosSnapshot = await getEmpleados();
        empleadoTableBody.innerHTML = ""; // Limpiar el contenido actual de la tabla

        empleadosSnapshot.forEach((doc) => {
            const empleado = doc.data();
            empleadoTableBody.innerHTML += `
                <tr>
                    <td>${doc.id}</td>
                    <td>${empleado.nombre}</td>
                    <td>${empleado.usuario}</td>
                    <td>${empleado.perfil}</td>
                    <td><img src="${empleado.fotoURL || 'dist/img/noImagen.png'}" width="50px"></td>
                    <td>
                        <button class="btn btn-warning btnEditEmpleado" data-id="${doc.id}" data-toggle="modal" data-target="#modalEditEmpleado">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="btn btn-danger btnDeleteEmpleado" data-id="${doc.id}">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar empleados:", error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al cargar los empleados.",
            icon: "error"
        });
    }
}

// Cargar empleados al cargar la página
renderEmpleados();

// Guardar un nuevo empleado
document.getElementById("saveEmpleadoBtn").addEventListener("click", async (e) => {
    e.preventDefault();

    const nombre = document.querySelector("input[name='newNombre']").value;
    const usuario = document.querySelector("input[name='newUsuario']").value;
    const perfil = document.querySelector("select[name='newPerfil']").value;

    if (!nombre || !usuario || !perfil) {
        Swal.fire({
            title: "Error",
            text: "Todos los campos son obligatorios.",
            icon: "warning"
        });
        return;
    }

    const empleado = { nombre, usuario, perfil };

    try {
        await saveEmpleado(empleado);

        Swal.fire({
            title: "Empleado agregado!",
            text: "El nuevo empleado ha sido agregado correctamente.",
            icon: "success"
        });

        renderEmpleados();
        document.getElementById("formAddEmpleado").reset(); // Limpiar el formulario
    } catch (error) {
        console.error("Error al guardar empleado:", error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al guardar el empleado.",
            icon: "error"
        });
    }
});

// Editar un empleado
document.addEventListener("click", async (e) => {
    if (e.target.closest(".btnEditEmpleado")) {
        const id = e.target.closest(".btnEditEmpleado").getAttribute("data-id");

        try {
            const empleadoDoc = await getEmpleado(id);
            const empleado = empleadoDoc.data();

            document.getElementById("editNombre").value = empleado.nombre;
            document.getElementById("editUsuario").value = empleado.usuario;
            document.getElementById("editPerfil").value = empleado.perfil;
            document.getElementById("updateEmpleadoBtn").setAttribute("data-id", id);
        } catch (error) {
            console.error("Error al obtener datos del empleado para edición:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al cargar los datos del empleado.",
                icon: "error"
            });
        }
    }
});

document.getElementById("updateEmpleadoBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    const id = e.target.getAttribute("data-id");
    const nombre = document.getElementById("editNombre").value;
    const usuario = document.getElementById("editUsuario").value;
    const perfil = document.getElementById("editPerfil").value;

    if (!nombre || !usuario || !perfil) {
        Swal.fire({
            title: "Error",
            text: "Todos los campos son obligatorios.",
            icon: "warning"
        });
        return;
    }

    const updatedEmpleado = { nombre, usuario, perfil };

    try {
        await updateEmpleado(id, updatedEmpleado);

        Swal.fire({
            title: "Empleado editado!",
            text: "Los cambios han sido guardados correctamente.",
            icon: "success"
        });
        renderEmpleados();
        $('#modalEditEmpleado').modal('hide'); // Cerrar el modal de edición
    } catch (error) {
        console.error("Error al actualizar empleado:", error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al editar el empleado.",
            icon: "error"
        });
    }
});

// Eliminar un empleado
document.addEventListener("click", (e) => {
    if (e.target.closest(".btnDeleteEmpleado")) {
        const id = e.target.closest(".btnDeleteEmpleado").getAttribute("data-id");

        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar!",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteEmpleado(id);

                    Swal.fire(
                        "Eliminado!",
                        "El empleado ha sido eliminado.",
                        "success"
                    );
                    renderEmpleados();
                } catch (error) {
                    console.error("Error al eliminar empleado:", error);
                    Swal.fire(
                        "Error",
                        "Hubo un problema al eliminar el empleado.",
                        "error"
                    );
                }
            }
        });
    }
});
