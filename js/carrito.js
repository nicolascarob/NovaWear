// ============================================
// CARRITO DE COMPRAS - NovaWear
// Ubicación: js/carrito.js
// Funcionalidades: +, -, eliminar, actualizar totales, ir a pago
// ============================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== 1. FUNCIÓN PARA FORMATEAR PESOS =====
    function formatearPesos(valor) {
        return new Intl.NumberFormat('es-CO').format(valor);
    }
    
    // ===== 2. ACTUALIZAR EL RESUMEN (subtotal, envío, total) =====
    function actualizarResumen() {
        const items = document.querySelectorAll('.carrito-item');
        let subtotal = 0;
        
        items.forEach(item => {
            // Obtener precio del producto (como número)
            const precioTexto = item.querySelector('.item-precio').textContent;
            const precio = parseInt(precioTexto.replace(/[^0-9]/g, ''));
            
            // Obtener cantidad
            const cantidad = parseInt(item.querySelector('.cantidad-num').textContent);
            
            // Calcular subtotal del producto
            const productSubtotal = precio * cantidad;
            subtotal += productSubtotal;
            
            // Actualizar el subtotal del producto en el DOM
            const subtotalElement = item.querySelector('.item-subtotal');
            subtotalElement.textContent = `$${formatearPesos(productSubtotal)} COP`;
        });
        
        // Valores fijos
        const costoEnvio = 15000;
        const total = subtotal + costoEnvio;
        
        // Actualizar el resumen en el DOM
        const subtotalElement = document.querySelector('.summary-row:first-child span:last-child');
        const totalElement = document.querySelector('.summary-row.total span:last-child');
        
        if (subtotalElement) {
            subtotalElement.textContent = `$${formatearPesos(subtotal)} COP`;
        }
        if (totalElement) {
            totalElement.textContent = `$${formatearPesos(total)} COP`;
        }
        
        // Actualizar el badge del carrito en el header (cantidad total de productos)
        let cantidadTotal = 0;
        items.forEach(item => {
            cantidadTotal += parseInt(item.querySelector('.cantidad-num').textContent);
        });
        const badgeCarrito = document.querySelector('.iconos-derecha .icono-con-badge .badge');
        if (badgeCarrito) {
            badgeCarrito.textContent = cantidadTotal;
        }
        
        // Guardar carrito en localStorage para la página de pago
        guardarCarritoEnLocalStorage();
    }
    
    // ===== 3. GUARDAR CARRITO EN LOCALSTORAGE =====
    function guardarCarritoEnLocalStorage() {
        const items = document.querySelectorAll('.carrito-item');
        const carritoData = [];
        
        items.forEach(item => {
            const nombre = item.querySelector('.item-detalles h3').textContent;
            const precioTexto = item.querySelector('.item-precio').textContent;
            const precio = parseInt(precioTexto.replace(/[^0-9]/g, ''));
            const cantidad = parseInt(item.querySelector('.cantidad-num').textContent);
            const imagen = item.querySelector('.item-img').style.backgroundImage;
            
            carritoData.push({
                nombre: nombre,
                precio: precio,
                cantidad: cantidad,
                imagen: imagen,
                subtotal: precio * cantidad
            });
        });
        
        localStorage.setItem('carritoNovaWear', JSON.stringify(carritoData));
    }
    
    // ===== 4. ACTUALIZAR UN ITEM ESPECÍFICO =====
    function actualizarItem(item, cambio) {
        const cantidadSpan = item.querySelector('.cantidad-num');
        let cantidadActual = parseInt(cantidadSpan.textContent);
        let nuevaCantidad = cantidadActual + cambio;
        
        if (nuevaCantidad < 1) return;
        
        cantidadSpan.textContent = nuevaCantidad;
        actualizarResumen();
    }
    
    // ===== 5. ELIMINAR UN ITEM =====
    function eliminarItem(item) {
        item.style.transition = 'opacity 0.3s';
        item.style.opacity = '0';
        
        setTimeout(() => {
            item.remove();
            actualizarResumen();
            
            const productosLista = document.querySelector('.productos-lista');
            if (productosLista && productosLista.children.length === 0) {
                productosLista.innerHTML = `
                    <div class="carrito-vacio">
                        <p>🛒 Tu carrito está vacío</p>
                        <a href="../index.html" class="btn-volver-carrito">Seguir comprando</a>
                    </div>
                `;
                // Actualizar badge a 0
                const badgeCarrito = document.querySelector('.iconos-derecha .icono-con-badge .badge');
                if (badgeCarrito) badgeCarrito.textContent = '0';
                localStorage.removeItem('carritoNovaWear');
            }
        }, 300);
    }
    
    // ===== 6. CONFIGURAR EVENTOS DE LOS BOTONES =====
    function configurarEventos() {
        // Botones de + y -
        const botonesCantidad = document.querySelectorAll('.cantidad-btn');
        botonesCantidad.forEach(boton => {
            boton.removeEventListener('click', manejadorClick);
            boton.addEventListener('click', manejadorClick);
        });
        
        function manejadorClick(e) {
            e.stopPropagation();
            const item = this.closest('.carrito-item');
            const esSumar = this.textContent === '+';
            actualizarItem(item, esSumar ? 1 : -1);
        }
        
        // Botones de eliminar
        const botonesEliminar = document.querySelectorAll('.item-eliminar');
        botonesEliminar.forEach(boton => {
            boton.removeEventListener('click', manejadorEliminar);
            boton.addEventListener('click', manejadorEliminar);
        });
        
        function manejadorEliminar(e) {
            e.stopPropagation();
            const item = this.closest('.carrito-item');
            eliminarItem(item);
        }
    }
    
    // ===== 7. BOTÓN "SEGUIR COMPRANDO" =====
    const btnVolver = document.querySelector('.btn-volver');
    if (btnVolver) {
        btnVolver.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
    
    // ===== 8. BOTÓN "PROCEDER AL PAGO" =====
    const btnProceder = document.querySelector('.btn-proceder');
    if (btnProceder) {
        btnProceder.addEventListener('click', function() {
            // Verificar que haya productos en el carrito
            const items = document.querySelectorAll('.carrito-item');
            if (items.length === 0) {
                alert('🛒 Tu carrito está vacío. Agrega productos antes de proceder al pago.');
                return;
            }
            
            // Guardar datos antes de ir a pago
            guardarCarritoEnLocalStorage();
            
            // Redirigir a la página de pago
            window.location.href = 'pago.html';
        });
    }
    
    // ===== 9. INICIALIZAR TODO =====
    actualizarResumen();
    configurarEventos();
});
