document.addEventListener("DOMContentLoaded", () => {
    // Buscamos el contenedor de la grilla en tu HTML de hombres
    const contenedor = document.getElementById("contenedor-productos") || document.querySelector(".grid-cards");

    if (!contenedor) {
        console.error("❌ No se encontró el contenedor de productos (.grid-cards) en el HTML.");
        return;
    }

    // 🔥 CORREGIDO: Eliminamos http://localhost:3000. La ruta relativa funciona en local y en Railway de forma automática.
    fetch("/api/productos?categoria=hombre")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then(productos => {
            console.log("Prendas de hombre cargadas desde MySQL con éxito:", productos);
            
            // Vaciamos la grilla estática vieja
            contenedor.innerHTML = "";

            if (productos.length === 0) {
                contenedor.innerHTML = `<p class="no-productos" style="text-align:center; width:100%; color:#666; grid-column: 1/-1;">No hay prendas registradas en el stock de hombre.</p>`;
                return;
            }

            // Recorremos los productos de hombre devueltos por la base de datos
            productos.forEach(prenda => {
                // CORRECCIÓN DE RUTAS: Ajusta la ruta si estás dentro de la carpeta 'pages'
                let rutaImagen = prenda.imagen;
                if (rutaImagen && !rutaImagen.startsWith("data:") && !rutaImagen.startsWith("../")) {
                    rutaImagen = "../" + rutaImagen;
                }

                // CORRECCIÓN DE PRECIOS: Usamos Math.round por si acaso para evitar que trunque a 299
                const precioExacto = Math.round(prenda.precio);

                // Estructura idéntica a tus estilos CSS (card-img, edit-badge-btn, card-info)
                // 🔥 RECOMENDACIÓN: Asegúrate de que las rutas a los enlaces también lleven la barra '/' al inicio si usas Express. Elegimos '/pages/edicion-producto.html' o '/edicion-producto.html' según tu estructura.
                const tarjetaHTML = `
                    <div class="product-card" data-id="${prenda.id}">
                        <div class="card-img" style="background-image: url('${rutaImagen}')" role="img" aria-label="${prenda.nombre}">
                            <a href="/pages/edicion-producto.html?id=${prenda.id}" class="edit-badge-btn" aria-label="Editar prenda">
                                <img src="../assets/iconos/edicion.svg" alt="Editar" class="edit-icon">
                            </a>
                        </div>
                        <div class="card-info">
                            <h3>${prenda.nombre}</h3>
                            <span class="precio">$${precioExacto.toLocaleString('es-CO')} COP</span>
                        </div>
                    </div>
                `;
                
                contenedor.insertAdjacentHTML("beforeend", tarjetaHTML);
            });
        })
        .catch(error => {
            console.error("❌ Error al conectar con la API de productos:", error);
            contenedor.innerHTML = `<p class="error-mensaje" style="grid-column: 1/-1; color: red; text-align: center;">Error al cargar el inventario real de hombres.</p>`;
        });
});
