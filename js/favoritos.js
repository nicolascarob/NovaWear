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
    // También actualizar el badge global por si acaso
    actualizarBadgeFavoritosGlobal();
}

// Función para normalizar la ruta de la imagen
function normalizarRutaImagen(ruta) {
    if (ruta.startsWith('../img/') || ruta.startsWith('../assets/')) {
        return ruta;
    }
    if (ruta.startsWith('img/')) {
        return '../' + ruta;
    }
    if (ruta.startsWith('assets/')) {
        return '../' + ruta;
    }
    return ruta;
}

// Agregar un producto a favoritos
function agregarAFavoritos(producto) {
    const favoritos = obtenerFavoritos();
    const existe = favoritos.some(p => p.id === producto.id);
    if (!existe) {
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

// Actualizar el contador del ícono de favoritos en el header (local)
function actualizarContadorFavoritos() {
    const favoritos = obtenerFavoritos();
    const contador = favoritos.length;
    
    const iconosFavoritos = document.querySelectorAll('.icono-favoritos');
    iconosFavoritos.forEach(icono => {
        let badge = icono.querySelector('.badge-favoritos, #favoritos-badge');
        if (!badge) {
            badge = document.getElementById('favoritos-badge');
        }
        
        if (contador > 0) {
            if (badge) {
                badge.textContent = contador;
                badge.style.display = 'flex';
            } else if (icono) {
                const nuevoBadge = document.createElement('span');
                nuevoBadge.className = 'badge-favoritos';
                nuevoBadge.id = 'favoritos-badge';
                nuevoBadge.textContent = contador;
                nuevoBadge.style.display = 'flex';
                icono.style.position = 'relative';
                icono.appendChild(nuevoBadge);
            }
        } else if (badge) {
            badge.style.display = 'none';
        }
    });
}

// ACTUALIZAR BADGE GLOBAL (para que funcione en todas las páginas)
function actualizarBadgeFavoritosGlobal() {
    const favoritos = obtenerFavoritos();
    const cantidad = favoritos.length;
    
    // Buscar por ID
    const badgePorId = document.getElementById('favoritos-badge');
    if (badgePorId) {
        if (cantidad > 0) {
            badgePorId.textContent = cantidad;
            badgePorId.style.display = 'flex';
        } else {
            badgePorId.style.display = 'none';
        }
    }
    
    // Buscar por clase
    const badgePorClase = document.querySelector('.badge-favoritos');
    if (badgePorClase && !badgePorId) {
        if (cantidad > 0) {
            badgePorClase.textContent = cantidad;
            badgePorClase.style.display = 'flex';
        } else {
            badgePorClase.style.display = 'none';
        }
    }
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
    // Forzar actualización del badge después del cambio
    setTimeout(() => {
        actualizarBadgeFavoritosGlobal();
    }, 10);
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
                <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${parseInt(producto.precio.replace(/[^0-9]/g, ''))}, '${producto.imagen}')">AGREGAR AL CARRITO</button>
            </div>
        </div>
    `).join('');
}

// Función para usar en la página de favoritos
function toggleFavoritoEnPagina(productoId) {
    eliminarDeFavoritos(productoId);
    renderizarFavoritos();
    actualizarBadgeFavoritosGlobal();
}

// Función para agregar al carrito (delegar a la función global si existe)
function agregarAlCarrito(id, nombre, precio, imagen) {
    if (typeof window.agregarAlCarritoGlobal === 'function') {
        window.agregarAlCarritoGlobal(id, nombre, precio, imagen);
    } else {
        // Función de respaldo
        let carrito = JSON.parse(localStorage.getItem('carritoNovaWear') || '[]');
        const existente = carrito.find(item => item.nombre === nombre);
        if (existente) {
            existente.cantidad = (existente.cantidad || 1) + 1;
        } else {
            carrito.push({ id: id, nombre: nombre, precio: precio, cantidad: 1, imagen: imagen });
        }
        localStorage.setItem('carritoNovaWear', JSON.stringify(carrito));
        if (typeof actualizarBadgeCarritoGlobal === 'function') {
            actualizarBadgeCarritoGlobal();
        }
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorFavoritos();
    actualizarBadgeFavoritosGlobal();
    sincronizarCorazones();
});
