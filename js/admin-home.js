document.addEventListener("DOMContentLoaded", () => {
    // 1. Capturamos el contenedor donde van las tarjetas del administrador
    const adminGrid = document.querySelector(".grid-cards");

    if (adminGrid) {
        // 2. Traemos las prendas en tiempo real desde la base de datos MySQL en internet
        // 🔥 CORREGIDO: Ahora apunta directamente a tu API en Railway
        fetch("https://novawear-production.up.railway.app/api/productos")
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener los productos de la base de datos");
                return res.json();
            })
            .then(productos => {
                // Limpiamos las tarjetas estáticas anteriores para renderizar las de MySQL
                adminGrid.innerHTML = "";

                // 3. Recorremos cada producto e inyectamos TU HTML original con las variables de la base de datos
                productos.forEach(p => {
                    let rutaImagen = p.imagen;

                    // Si la ruta es local (ej: 'img/prenda.jpg'), le ponemos '../' para que cargue bien desde /pages/
                    if (!rutaImagen.startsWith('data:') && !rutaImagen.startsWith('http') && !rutaImagen.startsWith('../')) {
                        rutaImagen = `../${rutaImagen}`;
                    }

                    // Formateamos el precio para Colombia (Ej: 250000 -> $250.000)
                    const precioFormateado = Number(p.precio).toLocaleString('es-CO');

                    // Inyectamos la estructura usando TUS clases exactas: "admin-photo-btn" y "camera-icon"
                    adminGrid.innerHTML += `
                        <div class="product-card" data-id="${p.id}">
                            
                            <a href="edicion-producto.html?id=${p.id}" class="admin-photo-btn" title="Editar producto" tabindex="0">
                                <img src="../assets/iconos/edicion.svg" alt="Editar" class="camera-icon">
                            </a>

                            <div class="card-img" style="background-image: url('${rutaImagen}')" role="img" aria-label="${p.nombre}">
                                </div>

                            <div class="card-info">
                                <h3>${p.nombre}</h3>
                                <span class="precio">$${precioFormateado} COP</span>
                            </div>

                        </div>
                    `;
                });
            })
            .catch(err => {
                console.error("Error cargando el catálogo del administrador:", err);
                adminGrid.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">No se pudieron cargar los productos en internet. Revisa la consola.</p>`;
            });
    }
});
