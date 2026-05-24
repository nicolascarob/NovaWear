// js/favoritos.js

// Clave para almacenar favoritos en localStorage
const STORAGE_KEY = 'novawear_favoritos';

// Obtener favoritos del localStorage
function obtenerFavoritos() {
    const favoritos = localStorage.getItem(STORAGE_KEY);
    return favoritos ? JSON.parse(favoritos) : [];
}

// Guardar favoritos en localStorage
function guardarFavoritos(favoritos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
    actualizarContadorFavoritos();
}

// Agregar un producto a favoritos
function agregarAFavoritos(producto) {
    const favoritos = obtenerFavoritos();
    
    // Verificar si ya existe
    const existe = favoritos.some(p => p.id === producto.id);
    if (!existe) {
        favoritos.push(producto);
        guardarFavoritos(favoritos);
        return true;
    }
    return false;
}

// Eliminar un producto de favoritos
function eliminarDeFavoritos(productoId) {
    let favoritos = obtenerFavoritos();
    favoritos = favoritos.filter(p => p.id !== productoId);
    guardarFavoritos(favoritos);
    return favoritos;
}

// Verificar si un producto está en favoritos
function esFavorito(productoId) {
    const favoritos = obtenerFavoritos();
    return favoritos.some(p => p.id === productoId);
}

// Actualizar el contador del ícono de favoritos en el header
function actualizarContadorFavoritos() {
    const favoritos = obtenerFavoritos();
    const contador = favoritos.length;
    
    // Buscar el badge dentro del icono de favoritos en todas las páginas
    const iconosFavoritos = document.querySelectorAll('.icono-favoritos');
    
    iconosFavoritos.forEach(icono => {
        let badge = icono.querySelector('.badge-favoritos');
        
        if (contador > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'badge-favoritos';
                icono.style.position = 'relative';
                icono.appendChild(badge);
            }
            badge.textContent = contador;
            badge.style.display = 'flex';
        } else if (badge) {
            badge.style.display = 'none';
        }
    });
}

// Función principal para toggle favorito
function toggleFavorito(btn, producto) {
    if (btn.classList.contains('liked')) {
        eliminarDeFavoritos(producto.id);
        btn.classList.remove('liked');
        btn.setAttribute('aria-pressed', 'false');
    } else {
        agregarAFavoritos(producto);
        btn.classList.add('liked');
        btn.setAttribute('aria-pressed', 'true');
    }
}

// Sincronizar todos los corazones en la página actual
function sincronizarCorazones() {
    document.querySelectorAll('.heart-btn').forEach(btn => {
        const productCard = btn.closest('.product-card');
        if (productCard && productCard.dataset.productId) {
            const productId = parseInt(productCard.dataset.productId);
            if (esFavorito(productId)) {
                btn.classList.add('liked');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('liked');
                btn.setAttribute('aria-pressed', 'false');
            }
        }
    });
}

// Renderizar productos favoritos en la página de favoritos
function renderizarFavoritos() {
    const gridFavoritos = document.querySelector('.grid-favoritos');
    if (!gridFavoritos) return;
    
    const favoritos = obtenerFavoritos();
    
    if (favoritos.length === 0) {
        gridFavoritos.innerHTML = `
            <div class="vacio-mensaje">
                <p>No tienes productos favoritos aún.</p>
                <a href="../index.html" class="btn-explorar">Explorar productos</a>
            </div>
        `;
        return;
    }
    
    gridFavoritos.innerHTML = favoritos.map(producto => `
        <div class="product-card" data-product-id="${producto.id}">
            <div class="card-img" style="background-image: url('${producto.imagen}')" role="img" aria-label="${producto.nombre}">
                <button class="heart-btn liked" onclick="toggleFavoritoEnPagina(${producto.id})" aria-pressed="true" aria-label="Eliminar de favoritos">
                    <img src="../assets/iconos/favoritos.svg" alt="Eliminar de favoritos" class="heart-icon">
                </button>
            </div>
            <div class="card-info">
                <h3>${producto.nombre}</h3>
                <span class="precio">${producto.precio}</span>
                <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id})">AGREGAR AL CARRITO</button>
            </div>
        </div>
    `).join('');
}

// Función para usar en la página de favoritos
function toggleFavoritoEnPagina(productoId) {
    eliminarDeFavoritos(productoId);
    renderizarFavoritos();
    actualizarContadorFavoritos();
}

// Función para agregar al carrito (demo)
function agregarAlCarrito(productoId) {
    alert('Producto agregado al carrito');
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorFavoritos();
    sincronizarCorazones();
});
// Función para normalizar la ruta de la imagen (arreglar rutas para favoritos)
function normalizarRutaImagen(ruta) {
    // Si la ruta ya tiene ../img/ o comienza con /, está bien
    if (ruta.startsWith('../img/') || ruta.startsWith('/img/')) {
        return ruta;
    }
    // Si la ruta es img/... (desde index), agregar ../
    if (ruta.startsWith('img/')) {
        return '../' + ruta;
    }
    // Si la ruta es ../assets/... o assets/...
    if (ruta.includes('assets/')) {
        return ruta;
    }
    return ruta;
}

// Modificar la función agregarAFavoritos para normalizar la ruta
function agregarAFavoritos(producto) {
    const favoritos = obtenerFavoritos();
    const existe = favoritos.some(p => p.id === producto.id);
    
    if (!existe) {
        // Normalizar la ruta de la imagen antes de guardar
        const productoNormalizado = {
            ...producto,
            imagen: normalizarRutaImagen(producto.imagen)
        };
        favoritos.push(productoNormalizado);
        guardarFavoritos(favoritos);
        return true;
    }
    return false;
}
