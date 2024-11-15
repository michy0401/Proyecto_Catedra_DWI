import { 
    savePromocion, 
    getPromociones, 
    getPromocion, 
    getPromocionListSize, 
    deletePromocion, 
    updatePromocion 
} from "./firebase.js";

let addButton = document.getElementById("submitdata");
addButton.addEventListener("click", AddData);

// Mostrar la lista de promociones
showData();

// Validación de los datos del formulario
function validateData() {
    let platillo = document.getElementById("newPlatillo").value.trim();
    let descripcion = document.getElementById("newDescripcion").value.trim();
    let estado = document.getElementById("newEstado").value;
    let fecInicio = document.getElementById("newFecInicio").value;
    let fecFin = document.getElementById("newFecFin").value;
    let imagen = document.getElementById("newPhoto");

    // Validar nombre del platillo
    if (platillo === "") {
        Swal.fire("Error", "Debe ingresar el nombre del platillo.", "error");
        return false;
    }

    // Validar descripción
    if (descripcion === "" || descripcion.length > 100) {
        Swal.fire("Error", "La descripción debe tener entre 1 y 100 caracteres.", "error");
        return false;
    }

    // Validar estado
    if (estado === "") {
        Swal.fire("Error", "Debe seleccionar un estado.", "error");
        return false;
    }

    // Validar fechas
    if (fecInicio === "" || fecFin === "" || new Date(fecInicio) > new Date(fecFin)) {
        Swal.fire("Error", "Las fechas deben ser válidas y el inicio anterior al fin.", "error");
        return false;
    }

    // Validar imagen
    if (imagen.files.length === 0) {
        Swal.fire("Error", "Debe seleccionar una imagen.", "error");
        return false;
    }
    const allowedFormats = /\.(jpg|jpeg|png|webp)$/i;
    if (!allowedFormats.exec(imagen.files[0].name) || imagen.files[0].size / 1024 > 2000) {
        Swal.fire("Error", "La imagen debe ser válida y menor a 2 MB.", "error");
        return false;
    }

    return true;
}

// Función para agregar promociones
async function AddData() {
    if (validateData()) {
        let platillo = document.getElementById("newPlatillo").value;
        let descripcion = document.getElementById("newDescripcion").value;
        let estado = document.getElementById("newEstado").value;
        let fecInicio = document.getElementById("newFecInicio").value;
        let fecFin = document.getElementById("newFecFin").value;
        let imagen = document.getElementById("newPhoto");
        let reader = new FileReader();

        reader.readAsDataURL(imagen.files[0]);
        reader.addEventListener("load", async () => {
            try {
                await savePromocion({
                    platillo, descripcion, estado, fecInicio, fecFin, imagen: reader.result
                });
                Swal.fire("Éxito", "Promoción agregada correctamente.", "success");
                // Resetear el formulario y actualizar la tabla
                document.getElementById("newPlatillo").value = "";
                document.getElementById("newDescripcion").value = "";
                document.getElementById("newEstado").value = "";
                document.getElementById("newFecInicio").value = "";
                document.getElementById("newFecFin").value = "";
                document.getElementById("newPhoto").value = "";
                showData();
            } catch (error) {
                Swal.fire("Error", "Ocurrió un error al agregar la promoción: " + error.message, "error");
            }
        });
    }
}

// Mostrar la lista de promociones
async function showData() {
    let html = "";
    const size = await getPromocionListSize();

    if (size === 0) {
        html = "<tr><td colspan='7'>No hay promociones disponibles.</td></tr>";
    } else {
        const promociones = await getPromociones();
        promociones.forEach((doc) => {
            const promocion = doc.data();
            html += `
                <tr>
                    <td>${promocion.platillo}</td>
                    <td>${promocion.descripcion}</td>
                    <td>${promocion.estado}</td>
                    <td>${promocion.fecInicio}</td>
                    <td>${promocion.fecFin}</td>
                    <td><img src="${promocion.imagen}" alt="Imagen" width="50" height="50"></td>
                    <td>
                        <button class="btn btn-warning btnEditPromocion" idPromocion="${doc.id}" data-bs-toggle="modal" data-bs-target="#newModal">Editar</button>
                        <button class="btn btn-danger btnDeletePromocion" idPromocion="${doc.id}">Eliminar</button>
                    </td>
                </tr>`;
        });
    }

    document.querySelector("#example2 tbody").innerHTML = html;

    // Botones de eliminación
    document.querySelectorAll('.btnDeletePromocion').forEach(btn => {
        btn.addEventListener('click', async (event) => {
            const idPromocion = btn.getAttribute('idPromocion');
            const confirm = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción no se puede deshacer.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            });

            if (confirm.isConfirmed) {
                try {
                    await deletePromocion(idPromocion);
                    Swal.fire("Eliminado", "Promoción eliminada correctamente.", "success");
                    showData();
                } catch (error) {
                    Swal.fire("Error", "Ocurrió un error al eliminar la promoción: " + error.message, "error");
                }
            }
        });
    });

    // Botones de edición
    document.querySelectorAll('.btnEditPromocion').forEach(btn => {
        btn.addEventListener('click', async (event) => {
            const idPromocion = btn.getAttribute('idPromocion');
            const promocion = (await getPromocion(idPromocion)).data();

            document.getElementById("newPlatillo").value = promocion.platillo;
            document.getElementById("newDescripcion").value = promocion.descripcion;
            document.getElementById("newEstado").value = promocion.estado;
            document.getElementById("newFecInicio").value = promocion.fecInicio;
            document.getElementById("newFecFin").value = promocion.fecFin;
            document.getElementById("submitdata").onclick = async () => {
                try {
                    await updatePromocion(idPromocion, {
                        platillo: document.getElementById("newPlatillo").value,
                        descripcion: document.getElementById("newDescripcion").value,
                        estado: document.getElementById("newEstado").value,
                        fecInicio: document.getElementById("newFecInicio").value,
                        fecFin: document.getElementById("newFecFin").value
                    });
                    Swal.fire("Éxito", "Promoción actualizada correctamente.", "success");
                    showData();
                } catch (error) {
                    Swal.fire("Error", "Ocurrió un error al actualizar la promoción: " + error.message, "error");
                }
            };
        });
    });
}

