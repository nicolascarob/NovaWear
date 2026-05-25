// ============================================
// CARRITO DE COMPRAS - NovaWear
// ============================================

const CARRITO_KEY = 'carritoNovaWear';

// ===== 1. FUNCIÓN PARA NORMALIZAR LA RUTA DE LA IMAGEN =====
function normalizarRutaImagen(ruta) {
    if (!ruta) return '../img/placeholder.jpg';
    
    // Si ya tiene ../img/ o img/, está bien
    if (ruta.startsWith('../img/') || ruta.startsWith('img/')) {
        return ruta;
    }
    
    // Si la ruta está vacía o es solo el nombre del archivo
    if (ruta.startsWith('/')) {
        return '.' + ruta;
    }
    
    // Si es una ruta completa de internet
    if (ruta.startsWith('http')) {
        return ruta;
    }
    
    // Por defecto, asumimos que la imagen está en ../img/
    return '../img/' + ruta.split('/').pop();
}

// ===== 2. FORMATEAR PESOS =====
function formatearPesos(valor) {
    return new Intl.NumberFormat('es-CO').format(valor);
}

// ===== 3. GUARDAR CARRITO =====
function guardarCarrito(carrito) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    actualizarBadgeCarrito();
}

// ===== 4. CARGAR CARRITO =====
function cargarCarrito() {
    const carrito = localStorage.getItem(CARRITO_KEY);
    return carrito ? JSON.parse(carrito) : [];
}

// ===== 5. ACTUALIZAR BADGE DEL CARRITO =====
function actualizarBadgeCarrito() {
    const carrito = cargarCarrito();
    const badge = document.getElementById('cart-badge');
    if (badge) {
        let totalProductos = 0;
        carrito.forEach(item => {
            totalProductos += item.cantidad;
        });
        badge.textContent = totalProductos;
        badge.style.display = 'flex';
    }
}

// ===== 6. ACTUALIZAR BADGE DE FAVORITOS =====
function actualizarBadgeFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('novawear_favoritos') || '[]');
    const badge = document.getElementById('favoritos-badge');
    if (badge) {
        const cantidad = favoritos.length;
        if (cantidad > 0) {
            badge.textContent = cantidad;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// ===== 7. ACTUALIZAR EL RESUMEN =====
function actualizarResumen() {
    const carrito = cargarCarrito();
    let subtotal = 0;
    
    carrito.forEach(item => {
        subtotal += item.precio * item.cantidad;
    });
    
    const costoEnvio = 15000;
    const total = subtotal + costoEnvio;
    
    const subtotalElement = document.getElementById('subtotal-resumen');
    const totalElement = document.getElementById('total-resumen');
    
    if (subtotalElement) subtotalElement.textContent = `$${formatearPesos(subtotal)} COP`;
    if (totalElement) totalElement.textContent = `$${formatearPesos(total)} COP`;
}

// ===== 8. RENDERIZAR PRODUCTOS EN EL CARRITO =====
function renderizarCarrito() {
    const carrito = cargarCarrito();
    const container = document.getElementById('productos-lista');
    
    if (!container) return;
    
    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="carrito-vacio">
                <p>🛒 Tu carrito está vacío</p>
                <a href="../index.html" class="btn-volver-carrito">Seguir comprando</a>
            </div>
        `;
        actualizarResumen();
        return;
    }
    
    let html = '';
    carrito.forEach((item, index) => {
        // Normalizar la ruta de la imagen
        const imagenUrl = normalizarRutaImagen(item.imagen);
        console.log(`Producto ${index}: ${item.nombre} -> imagen: ${imagenUrl}`);
        
        html += `
            <div class="carrito-item" data-index="${index}">
                <div class="item-img" style="background-image: url('${imagenUrl}')" role="img" aria-label="${item.nombre || 'Producto'}"></div>
                <div class="item-detalles">
                    <h3>${item.nombre || 'Producto sin nombre'}</h3>
                    <p class="item-precio">$${formatearPesos(item.precio || 0)} COP</p>
                    <div class="item-cantidad">
                        <button class="cantidad-btn" data-action="decrease" data-index="${index}" aria-label="Disminuir cantidad">-</button>
                        <span class="cantidad-num">${item.cantidad || 1}</span>
                        <button class="cantidad-btn" data-action="increase" data-index="${index}" aria-label="Aumentar cantidad">+</button>
                    </div>
                    <button class="item-eliminar" data-index="${index}" aria-label="Eliminar producto">Eliminar</button>
                </div>
                <div class="item-subtotal">
                    $${formatearPesos((item.precio || 0) * (item.cantidad || 1))} COP
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    actualizarResumen();
    
    // Agregar event listeners
    document.querySelectorAll('.cantidad-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            const action = btn.dataset.action;
            modificarCantidad(index, action === 'increase' ? 1 : -1);
        });
    });
    
    document.querySelectorAll('.item-eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            eliminarItem(index);
        });
    });
}

// ===== 9. MODIFICAR CANTIDAD =====
function modificarCantidad(index, cambio) {
    const carrito = cargarCarrito();
    if (index >= 0 && index < carrito.length) {
        const nuevaCantidad = carrito[index].cantidad + cambio;
        if (nuevaCantidad < 1) {
            eliminarItem(index);
        } else {
            carrito[index].cantidad = nuevaCantidad;
            guardarCarrito(carrito);
            renderizarCarrito();
        }
    }
}

// ===== 10. ELIMINAR ITEM =====
function eliminarItem(index) {
    const carrito = cargarCarrito();
    if (index >= 0 && index < carrito.length) {
        carrito.splice(index, 1);
        guardarCarrito(carrito);
        renderizarCarrito();
    }
}

// ===== 11. BOTONES =====
function setupBotones() {
    const btnVolver = document.getElementById('btn-volver');
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }
    
    const btnProceder = document.getElementById('btn-proceder');
    if (btnProceder) {
        btnProceder.addEventListener('click', () => {
            const carrito = cargarCarrito();
            if (carrito.length === 0) {
                alert('🛒 Tu carrito está vacío. Agrega productos antes de proceder al pago.');
                return;
            }
            window.location.href = 'pago.html';
        });
    }
}

// ===== 12. INICIALIZAR =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Carrito.js inicializado');
    renderizarCarrito();
    actualizarBadgeCarrito();
    actualizarBadgeFavoritos();
    setupBotones();
    
    window.addEventListener('storage', function(e) {
        if (e.key === CARRITO_KEY) {
            renderizarCarrito();
            actualizarBadgeCarrito();
        }
        if (e.key === 'novawear_favoritos') {
            actualizarBadgeFavoritos();
        }
    });
});
