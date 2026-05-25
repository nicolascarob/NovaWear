document.addEventListener("DOMContentLoaded", () => {
    // Buscamos tu contenedor real de la grilla
    const contenedor = document.getElementById("contenedor-productos") || document.querySelector(".grid-cards");

    if (!contenedor) {
        console.error("❌ No se encontró el contenedor de productos (.grid-cards) en el HTML.");
        return;
    }

    // 🔥 CORREGIDO: Eliminamos 'http://localhost:3000' para que Railway use enrutamiento relativo automático
    fetch("/api/productos?categoria=mujer")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then(productos => {
            console.log("Prendas de mujer cargadas desde MySQL con éxito:", productos);
            
            // Vaciamos la grilla estática
            contenedor.innerHTML = "";

            if (productos.length === 0) {
                contenedor.innerHTML = `<p class="no-productos" style="text-align:center; width:100%; color:#666; grid-column: 1/-1;">No hay prendas registradas en el stock de mujer.</p>`;
                return;
            }

            // Recorremos los productos reales
            productos.forEach(prenda => {
                // CORRECCIÓN DE RUTAS: Si la imagen viene como "img/..." desde la BD base, 
                // le agregamos el "../" para que salga correctamente desde la carpeta 'pages'
                let rutaImagen = prenda.imagen;
                if (rutaImagen && !rutaImagen.startsWith("data:") && !rutaImagen.startsWith("../")) {
                    rutaImagen = "../" + rutaImagen;
                }

                // ESTRUCTURA CORREGIDA: Ajustada exactamente a tus estilos CSS (card-img, edit-badge-btn, card-info)
                // 🔥 RECOMENDACIÓN: Aseguramos el enlace de edición con una barra absoluta '/' al inicio (por ej: '/pages/edicion-producto.html')
                const tarjetaHTML = `
                    <div class="product-card" data-id="${prenda.id}">
                        <div class="card-img" style="background-image: url('${rutaImagen}')" role="img" aria-label="${prenda.nombre}">
                            <a href="/pages/edicion-producto.html?id=${prenda.id}" class="edit-badge-btn" aria-label="Editar prenda">
                                <img src="../assets/iconos/edicion.svg" alt="Editar" class="edit-icon">
                            </a>
                        </div>
                        <div class="card-info">
                            <h3>${prenda.nombre}</h3>
                            <span class="precio">$${parseInt(prenda.precio).toLocaleString('es-CO')} COP</span>
                        </div>
                    </div>
                `;
                
                contenedor.insertAdjacentHTML("beforeend", tarjetaHTML);
            });
        })
        .catch(error => {
            console.error("❌ Error al conectar con la API de productos:", error);
            contenedor.innerHTML = `<p class="error-mensaje" style="grid-column: 1/-1; color: red; text-align: center;">Error al cargar el inventario real.</p>`;
        });
});
