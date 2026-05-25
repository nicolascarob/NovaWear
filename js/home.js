// js/home.js

// Mantener el array dinámico para interactuar con los favoritos
let productosIndex = [];

// Función para manejar favoritos en index
function handleFavoritoIndex(btn, productId) {
    const producto = productosIndex.find(p => p.id === productId);
    if (producto) {
        toggleFavorito(btn, producto);
    }
}

// Inicializar index consumiendo la base de datos real
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorFavoritos();
    
    // Buscamos el contenedor de las tarjetas en tu index público
    const contenedorClientes = document.querySelector(".grid-cards") || document.getElementById("contenedor-productos-clientes");

    if (contenedorClientes) {
        // 🔥 CONEXIÓN REAL AL BACKEND: Cargamos solo los productos públicos con protección anti-caché
        fetch(`https://novawear-production.up.railway.app/productos/publicos?t=${Date.now()}`)
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener productos de la tienda");
                return res.json();
            })
            .then(data => {
                productosIndex = data; // Guardamos los datos reales en el array local
                contenedorClientes.innerHTML = ""; // Limpiamos las tarjetas estáticas del HTML

                if (productosIndex.length === 0) {
                    contenedorClientes.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:#666;">No hay productos disponibles en este momento.</p>`;
                    return;
                }

                // Dibujamos las tarjetas dinámicamente con los datos de Railway (precios, nombres e imágenes)
                productosIndex.forEach(producto => {
                    const esFav = typeof esFavorito === 'function' ? esFavorito(producto.id) : false;
                    
                    // Si estás en el index, las imágenes están directamente en la carpeta 'img/' de la raíz
                    let rutaImagen = producto.imagen;

                    const tarjetaHTML = `
                        <div class="product-card" data-product-id="${producto.id}" data-id="${producto.id}">
                            <div class="card-img" style="background-image: url('${rutaImagen}')" role="img" aria-label="${producto.nombre}">
                                <button class="heart-btn ${esFav ? 'liked' : ''}" aria-label="Añadir a favoritos" aria-pressed="${esFav}" onclick="handleFavoritoIndex(this, ${producto.id})">
                                    <svg class="heart-icon" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="card-info">
                                <h3>${producto.nombre}</h3>
                                <span class="precio">$${parseInt(producto.precio).toLocaleString('es-CO')} COP</span>
                                <button class="btn-agregar-carrito">Agregar al carrito</button>
                            </div>
                        </div>
                    `;
                    contenedorClientes.insertAdjacentHTML("beforeend", tarjetaHTML);
                });

                // Re-vincular los eventos de agregar al carrito a los nuevos botones dinámicos
                document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        alert('Producto agregado al carrito');
                    });
                });
            })
            .catch(error => {
                console.error("❌ Error al cargar los productos en la vista del cliente:", error);
            });
    }
});
