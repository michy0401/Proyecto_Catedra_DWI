import { savePlatillo, getPlatillos, getPlatillo, gePlatilloListSize, deletePlatillo, updatePlatillo } from "./firebase.js";

let addButton = document.getElementById("submitdata");
addButton.addEventListener("click", AddData);

showData();

function validateData(){
    let platillo = document.getElementById("newPlatillo").value.trim();
    let descripcion = document.getElementById("newDescripcion").value.trim();
    let precio = parseFloat(document.getElementById("newPrice").value.trim()); // Cambié para asegurar que sea un número
    let categoria = document.getElementById("newCategoria").value.trim(); // Cambié a ID correcto
    let estado = document.getElementById("newEstado").value.trim();

    let foto = document.getElementById("newPhoto");
    if(platillo == ""){
        document.getElementById("name-error-msg").innerHTML="You must enter the name";
        return false;
    }
    else{
        document.getElementById("name-error-msg").innerHTML="";
    }

    if(descripcion == ""){
        document.getElementById("disc-error-msg").innerHTML="You must enter the description";
        return false;
    }
    else{
        document.getElementById("disc-error-msg").innerHTML="";
    }

    if(isNaN(precio) || precio <= 0){
        document.getElementById("price-error-msg").innerHTML="You must enter a valid price";
        return false;
    }
    else{
        document.getElementById("price-error-msg").innerHTML="";
    }

    if(categoria == ""){
        alert("You must select a category");
        return false;
    } 

    if(estado == ""){
        alert("You must select a status");
        return false;
    }

    if(foto.files.length == 0){
        document.getElementById("image-error-msg").innerHTML="You must select an image";
        return false;
    }
    else{
        document.getElementById("image-error-msg").innerHTML="";  
    }

    let allowedFormats = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
    if(!allowedFormats.exec(foto.files[0].name)){
        document.getElementById("image-error-msg").innerHTML="You must select a valid image";
        foto.value = "";
        return false;
    }
    else{
        document.getElementById("image-error-msg").innerHTML="";  
    }

    let fileSize = foto.files[0].size / 1024;
    if(fileSize > 700){
        document.getElementById("image-error-msg").innerHTML="You max file size is 700 KB";
        foto.value = "";
        return false;
    }
    else{
        document.getElementById("image-error-msg").innerHTML="";  
    }

    return true;
}


async function AddData() {
    if (validateData()) {
        // Leyendo los valores de los campos del formulario
        let name = document.querySelector("[name='newPlatillo']").value; // Nombre del platillo
        let price = document.querySelector("[name='newPrice']").value; // Precio
        let description = document.querySelector("[name='newDescripcion']").value; // Descripción
        let category = document.querySelector("[name='newCategoria']").value; // Categoría
        let status = document.querySelector("[name='newEstado']").value; // Estado

        let image = document.querySelector("input[name='newPhoto']").files[0]; // Foto del platillo
        let reader = new FileReader();
        
        if (image) {
            reader.readAsDataURL(image); // Leer la imagen como Data URL
            reader.addEventListener("load", () => {
                // Guardamos el platillo en Firebase con los datos obtenidos
                savePlatillo({
                    platillo: name,
                    precio: price,
                    descripcion: description,
                    categoria: category,
                    estado: status,
                    foto: reader.result // La imagen como Data URL
                });
            });
        } else {
            alertify.error("Please upload an image for the platillo."); // Si no se sube imagen
        }

        // Limpiando los campos después de guardar el platillo
        document.querySelector("[name='newPlatillo']").value = "";
        document.querySelector("[name='newDescripcion']").value = "";
        document.querySelector("[name='newPrice']").value = "";
        document.querySelector("[name='newCategoria']").value = "";
        document.querySelector("[name='newEstado']").value = "";
        document.querySelector("input[name='newPhoto']").value = ""; // Limpiar archivo subido

        // Cerrando el modal
        document.getElementById("modalAddPlatillo").querySelector(".close").click();

        // Mostrando mensaje de éxito
        alertify.success("Platillo added successfully!");
        
        // Actualizando la lista de platillos
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
                                <img src="dist/img/noImagen.png" class="img-fluid d-block">
                            </div>
                        </div>
                    </div>
                </div>`;
    } else {
        const platilloList = await getPlatillos();
        platilloList.forEach((element, index) => {
            const platillo = element.data();
            html += `<tr>
                        <td>${platillo.platillo}</td>
                        <td>${platillo.descripcion}</td>
                        <td>${platillo.precio}</td>
                        <td>${platillo.categoria}</td>
                        <td>${platillo.estado}</td>
                        <td><img src="${platillo.foto}" alt="Image" width="50" height="50"></td>
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

    document.querySelector("#example1 tbody").innerHTML = html;

    document.querySelectorAll('.btnDeletePlatillo').forEach(btn => {
        btn.addEventListener('click', (event) => {
            alertify.confirm("Confirmation", "Do you want to delete this platillo?",
                function () {
                    deletePlatillo(event.target.getAttribute('idPlatillo'));
                    alertify.success('Platillo deleted successfully');
                    showData();
                },
                function () {}
            );
        });
    });

    document.querySelectorAll('.btnEditPlatillo').forEach(btn => {
        btn.addEventListener('click', async (event) => {
            const platilloId = event.target.getAttribute('idPlatillo');
            let platillo = await getPlatillo(platilloId);
            platillo = platillo.data();

            document.getElementById("editPlatillo").value = platillo.platillo;
            document.getElementById("editDescripcion").value = platillo.descripcion;
            document.getElementById("editPrice").value = platillo.precio;
            document.getElementById("editCategoria").value = platillo.categoria;
            document.getElementById("editEstado").value = platillo.estado;
            document.getElementById("currentPhoto").value = platillo.foto;
            document.querySelector(".preview").src = platillo.foto;
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Aquí va tu código para asignar el evento 'onclick' de forma segura

    document.querySelector("#update").onclick = function () {
        const id = document.getElementById("id-edit").value;
        const platillo = document.getElementById("name-edit").value;
        const descripcion = document.getElementById("description-edit").value;
        const precio = document.getElementById("price-edit").value;
        const categoria = document.getElementById("category-edit").value;
        const estado = document.getElementById("status-edit").value;

        updatePlatillo(id, { platillo, descripcion, precio, categoria, estado });
        showData();
        document.getElementById("btn-close").click();
        alertify.success("Platillo updated successfully");
    };
});
