import { savePlatillo, getPlatillos, getPlatillo, gePlatilloListSize, deletePlatillo, updatePlatillo } from "./firebase.js";

let addButton = document.getElementById("submitdata");
addButton.addEventListener("click", AddData);

// Mostrar la lista de platillos
showData();

// Validación de los datos del formulario
function validateData() {
    let platillo = document.getElementById("newPlatillo").value.trim();
    let descripcion = document.getElementById("newDescripcion").value.trim();
    let precio = document.getElementById("newPrice").value.trim();
    let categoria = document.getElementById("newCategoria").value;
    let estado = document.getElementById("newEstado").value;
    let imagen = document.getElementById("newPhoto");

    // Validar nombre del platillo
    if (platillo === "") {
        document.getElementById("name-error-msg").innerHTML = "Debe ingresar el nombre del platillo";
        console.log("Validation result: false - Nombre vacío");
        return false;
    } else {
        document.getElementById("name-error-msg").innerHTML = "";
    }

    // Validar descripción
    if (descripcion === "") {
        document.getElementById("disc-error-msg").innerHTML = "Debe ingresar una descripción";
        console.log("Validation result: false - Descripción vacía");
        return false;
    } else if (descripcion.length > 100) {
        document.getElementById("disc-error-msg").innerHTML = "La descripción debe tener un máximo de 100 caracteres";
        console.log("Validation result: false - Descripción demasiado larga");
        return false;
    } else {
        document.getElementById("disc-error-msg").innerHTML = "";
    }

    // Validar precio
    if (precio === "") {
        document.getElementById("price-error-msg").innerHTML = "Debe ingresar el precio";
        console.log("Validation result: false - Precio vacío");
        return false;
    } else if (parseFloat(precio) <= 0 || isNaN(parseFloat(precio))) {
        document.getElementById("price-error-msg").innerHTML = "Debe ingresar un precio válido";
        console.log("Validation result: false - Precio inválido");
        return false;
    } else {
        document.getElementById("price-error-msg").innerHTML = "";
    }

    // Validar categoría
    if (categoria === "") {
        document.getElementById("categoria-error-msg").innerHTML = "Debe seleccionar una categoría";
        console.log("Validation result: false - Categoría no seleccionada");
        return false;
    } else {
        document.getElementById("categoria-error-msg").innerHTML = "";
    }

    // Validar estado
    if (estado === "") {
        document.getElementById("estado-error-msg").innerHTML = "Debe seleccionar un estado";
        console.log("Validation result: false - Estado no seleccionado");
        return false;
    } else {
        document.getElementById("estado-error-msg").innerHTML = "";
    }

    // Validar imagen
    if (imagen.files.length === 0) {
        document.getElementById("image-error-msg").innerHTML = "Debe seleccionar una imagen";
        console.log("Validation result: false - Imagen no seleccionada");
        return false;
    } else {
        document.getElementById("image-error-msg").innerHTML = "";
    }

    let allowedFormats = /\.(jpg|jpeg|png|webp)$/i;
    if (!allowedFormats.exec(imagen.files[0].name)) {
        document.getElementById("image-error-msg").innerHTML = "Debe seleccionar una imagen válida (JPG, JPEG, PNG, WEBP)";
        imagen.value = "";
        console.log("Validation result: false - Formato de imagen inválido");
        return false;
    }

    let fileSize = imagen.files[0].size / 1024;
    if (fileSize > 2000) {  // Ajuste a 2 MB
        document.getElementById("image-error-msg").innerHTML = "El tamaño máximo de la imagen es 2 MB";
        imagen.value = "";
        console.log("Validation result: false - Imagen demasiado grande");
        return false;
    } else {
        document.getElementById("image-error-msg").innerHTML = "";
    }

    console.log("Validation result: true - Todos los datos son válidos");
    return true;
}


// Función para agregar datos
async function AddData(){
    if(validateData()){ 
        // Leyendo los valores de los campos
        let platillo=document.getElementById("newPlatillo").value;
        let descripcion=document.getElementById("newDescripcion").value;
        let precio= document.getElementById("newPrice").value;
        let categoria= document.getElementById("newCategoria").value;
        let estado= document.getElementById("newEstado").value;
        let imagen=document.getElementById("newPhoto");
        let reader=new FileReader();
        reader.readAsDataURL(imagen.files[0]);
        reader.addEventListener("load",()=>{
            // Guardamos el registro en firebase
            savePlatillo({
                categoria, descripcion, estado, imagen:reader.result, platillo, precio 
            });
        });

        

        // Limpiando campos
        document.getElementById("newPlatillo").value="";
        document.getElementById("newDescripcion").value="";
        document.getElementById("newPrice").value="";
        document.getElementById("newCategoria").value="";
        document.getElementById("newEstado").value="";
        document.getElementById("newPhoto").value="";
        
        // Cerrando el modal
        document.getElementById("close-btn").click();
        Swal.fire({
            title: "Platillo agregado exitosamente!",
            text: " ",
            icon: "success"
        });
        showData();
    }

}


async function showData() {
    let html = "";
    const size = await gePlatilloListSize();

    if (size == 0) {
        html = `<div class="card-body">
                    <div class="row gx-2">
                        <div class="col">
                            <div class="p-3">
                            </div>
                        </div>
                    </div>
                </div>`;
    } else {
        const platilloList = await getPlatillos();
        platilloList.forEach((element) => {
            const platillo = element.data();
            html += `<tr>
                        
                        <td>${platillo.platillo}</td>
                        <td>${platillo.descripcion}</td>
                        <td>${platillo.precio}</td>
                        <td>${platillo.categoria}</td>
                        <td>${platillo.estado}</td>
                        <td><img src="${platillo.imagen}" alt="Image" width="50" height="50"></td>
                        <td>
                            <div class="btn-group">
                                <button class="btn btn-warning btnEditPlatillo" idPlatillo="${element.id}" data-toggle="modal" data-target="#modalEditPlatillo">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button class="btn btn-danger btnDeletePlatillo" idPlatillo="${element.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>`;
        });
    }

    document.querySelector("#example2 tbody").innerHTML = html;

    document.querySelectorAll('.btnDeletePlatillo').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const idPlatillo = event.currentTarget.getAttribute('idPlatillo');
        
            // Hacer console.log del idPlatillo
            console.log("ID del platillo:", idPlatillo);

            Swal.fire({
                title: "Confirmación",
                text: "¿Quieres eliminar este platillo?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Llamada a la función de eliminación del platillo
                    deletePlatillo(idPlatillo);
                    
                    // Mostrar mensaje de éxito
                    Swal.fire(
                        'Eliminado',
                        'El platillo ha sido eliminado correctamente.',
                        'success'
                    );
                    // Volver a mostrar los datos
                    showData();
                }
            });
        });
    });


    
    // Recuperar todos los botones con la clase btnEditPlatillo
    // Recuperar todos los botones con la clase btnEditPlatillo
    document.querySelectorAll('.btnEditPlatillo').forEach(btn => {

        btn.addEventListener('click', async (event) => {
            
            // Obtener el ID del platillo desde el atributo personalizado del botón
            const platilloId = btn.getAttribute('idPlatillo');
            
            try {
                // Recuperar el platillo desde Firebase usando su ID
                const platilloDoc = await getPlatillo(platilloId);
                if (!platilloDoc.exists) {
                    console.error("El platillo no existe en la base de datos.");
                    return;
                }
                
                const platilloData = platilloDoc.data();

                // Asignar valores a los campos del formulario de edición
                document.getElementById("id-edit").value = platilloId;
                document.getElementById("editPlatillo").value = platilloData.platillo;
                document.getElementById("editDescripcion").value = platilloData.descripcion;
                document.getElementById("editPrice").value = platilloData.precio;

                // Actualizar la categoría seleccionada
                document.getElementById("editCategoria").value = platilloData.categoria || "";

                // Actualizar el estado seleccionado
                document.getElementById("editEstado").value = platilloData.estado || "";

                // Mostrar la imagen (si está disponible)
                const imageDiv = document.getElementById("image-div");
                imageDiv.innerHTML = platilloData.imagen 
                    ? `<img src="${platilloData.imagen}" alt="Image" width="50" height="50">` 
                    : `<p>No image available</p>`;

            } catch (error) {
                console.error("Error al recuperar el platillo:", error);
            }
        });
    });


}

// Acción para guardar los cambios al editar el platillo
document.querySelector("#update").onclick = function () {
    const id = document.getElementById("id-edit").value;
    const platillo = document.getElementById("editPlatillo").value;
    const descripcion = document.getElementById("editDescripcion").value;
    const precio = document.getElementById("editPrice").value;
    const categoria = document.getElementById("editCategoria").value;
    const estado = document.getElementById("editEstado").value;

    // Llamar la función para actualizar el platillo
    updatePlatillo(id, { categoria, descripcion, estado, platillo, precio });

    // Mostrar los datos actualizados
    showData();

    // Cerrar el modal
    document.getElementById("btn-close").click();

    // Limpiar los campos del formulario
    document.getElementById("id-edit").value = "";
    document.getElementById("editPlatillo").value = "";
    document.getElementById("editDescripcion").value = "";
    document.getElementById("editPrice").value = "";
    document.getElementById("editCategoria").value = "";
    document.getElementById("editEstado").value = "";

    // Mostrar mensaje de éxito
    Swal.fire({
        title: "Platillo editado exitosamente!",
        text: "Los cambios han sido guardados correctamente.",
        icon: "success"
    });
};
