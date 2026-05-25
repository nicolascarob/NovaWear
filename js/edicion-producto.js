document.addEventListener("DOMContentLoaded", () => {
    // 1. Capturar de forma dinámica el ID de la prenda desde la URL (?id=X)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const idInput = document.getElementById('productId');
    const nameInput = document.getElementById('productName');
    const priceInput = document.getElementById('productPrice');
    const descInput = document.getElementById('productDescription');
    const imageDisplay = document.getElementById('productImageDisplay');
    
    // Buscamos el botón por su clase CSS real para que no quede estático
    const btnEliminar = document.querySelector('.btn-eliminar');

    let base64ImageString = ""; // Almacenará la nueva imagen si se cambia desde el equipo

    // 2. Traer los datos reales de la prenda seleccionada desde MySQL en Railway
    if (productId) {
        idInput.value = productId;
        
        // 🔥 CORREGIDO: Now pide los datos del producto a tu servidor en internet
        fetch(`https://novawear-production.up.railway.app/producto/${productId}`)
            .then(response => {
                if (!response.ok) throw new Error("Producto no encontrado en la base de datos.");
                return response.json();
            })
            .then(producto => {
                // Rellenamos dinámicamente los campos con la información de la prenda en edición
                nameInput.value = producto.nombre;
                priceInput.value = producto.precio;
                descInput.value = producto.descripcion;

                // Verificamos el origen de la imagen (Ruta local o String en Base64)
                if (producto.imagen.startsWith('img/') || producto.imagen.startsWith('../img/')) {
                    imageDisplay.style.backgroundImage = `url('../${producto.imagen.replace('../', '')}')`;
                } else {
                    imageDisplay.style.backgroundImage = `url('${producto.imagen}')`;
                }
            })
            .catch(error => {
                console.error("Error al cargar los datos del producto desde MySQL:", error);
                alert("No se pudo conectar con la base de datos para recuperar la información de esta prenda.");
            });
    } else {
        // Alerta de seguridad por si entran a la página sin un ID de producto válido
        alert("Atención: No se ha detectado ningún ID de producto en la URL.");
    }

    // 3. Previsualizar la nueva foto en tiempo real si el administrador la cambia
    const fileInput = document.getElementById('editProductFileInput');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    imageDisplay.style.backgroundImage = `url('${event.target.result}')`;
                    base64ImageString = event.target.result; // Almacenamos el string completo para la base de datos
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 4. Capturar el evento "GUARDAR CAMBIOS" para la prenda actual
    const editForm = document.getElementById('editProductForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Limpieza del precio: removemos caracteres no numéricos
            let precioLimpio = priceInput.value.replace(/[^0-9]/g, '');
            precioLimpio = parseInt(precioLimpio, 10);

            if (isNaN(precioLimpio)) {
                alert("Por favor, introduce un valor numérico válido para el precio.");
                return;
            }

            // Estructura de datos dinámica que recibirá el UPDATE en server.js
            const updatedData = {
                id: idInput.value, // ID capturado del formulario
                nombre: nameInput.value,
                precio: precioLimpio,
                descripcion: descInput.value,
                imagen: base64ImageString || null, // Si es null, el servidor mantiene la imagen original
                visible_tienda: 1 // 🔥 ADICIONADO: Garantiza que se guarde visible para la vista de clientes
            };

            // 🔥 CORREGIDO: Petición HTTP PUT apuntando al servidor en internet
            fetch(`https://novawear-production.up.railway.app/api/productos/${updatedData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('¡Excelente! Los cambios se guardaron correctamente en la base de datos.');
                    window.location.href = 'admin-home.html'; // Redirección automática al panel
                } else {
                    alert('Error reportado por el servidor: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error en el envío de datos:', error);
                alert('Hubo un problema de red y no se pudo establecer comunicación con el servidor.');
            });
        });
    }

    // 5. Eliminar la prenda actual dinámicamente mediante su ID
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            // Validación de seguridad: usamos la variable 'productId' extraída de la URL directamente
            if (!productId) {
                alert("No se identificó el ID de la prenda a eliminar.");
                return;
            }

            const confirmar = confirm(`¿Estás completamente seguro de que deseas eliminar la prenda con ID ${productId} del catálogo? Esta acción borrará el registro en MySQL permanentemente.`);

            if (confirmar) {
                // 🔥 CORREGIDO: Envío de la petición DELETE a la API en internet
                fetch(`https://novawear-production.up.railway.app/api/productos/${productId}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('La prenda ha sido retirada exitosamente del catálogo de NovaWear.');
                        window.location.href = 'admin-home.html'; // Retorno directo al catálogo visual
                    } else {
                        alert('Error al intentar eliminar: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error en la baja del producto:', error);
                    alert('Error en la comunicación con la API para realizar la baja de la prenda.');
                });
            }
        });
    }
});
