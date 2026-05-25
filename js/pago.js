// ============================================
// PÁGINA DE PAGO - NovaWear
// Simulación profesional de pagos
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== 1. FORMATEAR PESOS =====
    function formatearPesos(valor) {
        return new Intl.NumberFormat('es-CO').format(valor);
    }
    
    // ===== 2. CARGAR DATOS DEL CARRITO DESDE LOCALSTORAGE =====
    function cargarCarrito() {
        const carritoData = localStorage.getItem('carritoNovaWear');
        if (!carritoData) {
            mostrarCarritoVacio();
            return [];
        }
        
        try {
            const carrito = JSON.parse(carritoData);
            if (carrito.length === 0) {
                mostrarCarritoVacio();
                return [];
            }
            return carrito;
        } catch(e) {
            mostrarCarritoVacio();
            return [];
        }
    }
    
    // Mostrar mensaje de carrito vacío
    function mostrarCarritoVacio() {
        const container = document.getElementById('productos-resumen');
        if (container) {
            container.innerHTML = `
                <div class="carrito-vacio-pago">
                    <p>🛒 No hay productos en tu carrito</p>
                    <a href="carrito.html" style="color: #000;">Ir al carrito</a>
                </div>
            `;
        }
        
        // Poner totales en 0
        document.getElementById('subtotal-valor').textContent = '$0 COP';
        document.getElementById('total-valor').textContent = '$0 COP';
    }
    
    // ===== 3. RENDERIZAR PRODUCTOS EN EL RESUMEN =====
    function renderizarResumen(carrito) {
        const container = document.getElementById('productos-resumen');
        if (!container) return;
        
        if (!carrito || carrito.length === 0) {
            mostrarCarritoVacio();
            return;
        }
        
        let subtotal = 0;
        let html = '';
        
        carrito.forEach(producto => {
            const subtotalProducto = producto.precio * producto.cantidad;
            subtotal += subtotalProducto;
            
            html += `
                <div class="producto-resumen-item">
                    <div class="producto-info">
                        <div class="producto-nombre">${producto.nombre}</div>
                        <div class="producto-cantidad">Cantidad: ${producto.cantidad}</div>
                    </div>
                    <div class="producto-precio">$${formatearPesos(subtotalProducto)} COP</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Actualizar totales
        const costoEnvio = 15000;
        const total = subtotal + costoEnvio;
        
        document.getElementById('subtotal-valor').textContent = `$${formatearPesos(subtotal)} COP`;
        document.getElementById('total-valor').textContent = `$${formatearPesos(total)} COP`;
        
        // Guardar total para usarlo después
        window.pagoActual = {
            subtotal: subtotal,
            envio: costoEnvio,
            total: total,
            productos: carrito
        };
    }
    
    // ===== 4. ACTUALIZAR BADGE DEL CARRITO =====
    function actualizarBadgeCarrito() {
        const carritoData = localStorage.getItem('carritoNovaWear');
        const badge = document.getElementById('cart-badge');
        if (!badge) return;
        
        if (!carritoData) {
            badge.textContent = '0';
            return;
        }
        
        try {
            const carrito = JSON.parse(carritoData);
            let totalProductos = 0;
            carrito.forEach(p => totalProductos += p.cantidad);
            badge.textContent = totalProductos;
        } catch(e) {
            badge.textContent = '0';
        }
    }
    
    // ===== 5. VALIDAR FORMULARIO =====
    function validarFormulario() {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiry = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;
        const email = document.getElementById('email').value;
        
        // Validaciones básicas
        if (cardNumber.length < 15) {
            alert('❌ Número de tarjeta inválido (mínimo 15 dígitos)');
            return false;
        }
        
        if (!expiry.match(/^\d{2}\/\d{2}$/)) {
            alert('❌ Formato de fecha inválido (MM/AA)');
            return false;
        }
        
        if (cvv.length < 3) {
            alert('❌ CVV inválido (mínimo 3 dígitos)');
            return false;
        }
        
        if (!cardName.trim()) {
            alert('❌ Ingresa el nombre en la tarjeta');
            return false;
        }
        
        if (!email.includes('@')) {
            alert('❌ Correo electrónico inválido');
            return false;
        }
        
        return true;
    }
    
    // ===== 6. PROCESAR PAGO (SIMULADO) =====
    function procesarPago(event) {
        event.preventDefault();
        
        // Verificar que haya productos
        if (!window.pagoActual || window.pagoActual.productos.length === 0) {
            alert('🛒 No hay productos en tu carrito. Agrega productos antes de pagar.');
            window.location.href = 'carrito.html';
            return;
        }
        
        // Validar formulario
        if (!validarFormulario()) return;
        
        // Obtener resultado seleccionado por el profesor/usuario
        const resultadoSeleccionado = document.getElementById('simulateResult').value;
        
        // Obtener datos del pago
        const email = document.getElementById('email').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const ultimos4 = cardNumber.replace(/\s/g, '').slice(-4);
        
        // Generar ID de transacción
        const transactionId = 'NV-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        
        // Mostrar modal según resultado
        let titulo = '';
        let mensaje = '';
        let icono = '';
        let detalles = '';
        
        switch(resultadoSeleccionado) {
            case 'approved':
                titulo = '¡Pago aprobado! ✅';
                mensaje = 'Tu pago ha sido procesado exitosamente.';
                icono = '✅';
                detalles = `
                    <strong>ID Transacción:</strong> ${transactionId}<br>
                    <strong>Monto:</strong> $${formatearPesos(window.pagoActual.total)} COP<br>
                    <strong>Método:</strong> Tarjeta terminada en ${ultimos4}<br>
                    <strong>Correo:</strong> ${email}<br>
                    <strong>Fecha:</strong> ${new Date().toLocaleString()}<br><br>
                    📧 Se ha enviado la factura a tu correo.
                `;
                
                // Guardar transacción aprobada
                guardarTransaccion('APROBADO', transactionId, window.pagoActual.total);
                
                // Limpiar carrito después de pago exitoso
                setTimeout(() => {
                    localStorage.removeItem('carritoNovaWear');
                }, 500);
                break;
                
            case 'rejected':
                titulo = 'Pago rechazado ❌';
                mensaje = 'Tu tarjeta fue rechazada. Intenta con otro método de pago.';
                icono = '❌';
                detalles = `
                    <strong>Motivo:</strong> Fondos insuficientes<br>
                    <strong>ID Transacción:</strong> ${transactionId}<br>
                    <strong>Monto:</strong> $${formatearPesos(window.pagoActual.total)} COP<br>
                    <strong>Fecha:</strong> ${new Date().toLocaleString()}<br><br>
                    💡 Sugerencia: Verifica el saldo de tu tarjeta o intenta con otra.
                `;
                guardarTransaccion('RECHAZADO', transactionId, window.pagoActual.total);
                break;
                
            case 'pending':
                titulo = 'Pago pendiente ⏳';
                mensaje = 'Tu pago está en proceso de verificación.';
                icono = '⏳';
                detalles = `
                    <strong>ID Transacción:</strong> ${transactionId}<br>
                    <strong>Monto:</strong> $${formatearPesos(window.pagoActual.total)} COP<br>
                    <strong>Estado:</strong> Pendiente de confirmación<br>
                    <strong>Fecha:</strong> ${new Date().toLocaleString()}<br><br>
                    📧 Te notificaremos por correo cuando sea confirmado.
                `;
                guardarTransaccion('PENDIENTE', transactionId, window.pagoActual.total);
                break;
        }
        
        // Mostrar modal
        mostrarModal(titulo, mensaje, icono, detalles, resultadoSeleccionado);
    }
    
    // ===== 7. GUARDAR TRANSACCIÓN =====
    function guardarTransaccion(estado, transactionId, monto) {
        const transaccion = {
            id: transactionId,
            fecha: new Date().toISOString(),
            fechaLegible: new Date().toLocaleString(),
            estado: estado,
            monto: monto,
            productos: window.pagoActual?.productos || [],
            cliente: {
                email: document.getElementById('email')?.value || '',
                nombreTarjeta: document.getElementById('cardName')?.value || ''
            }
        };
        
        // Obtener historial existente
        let historial = JSON.parse(localStorage.getItem('transaccionesNovaWear') || '[]');
        historial.unshift(transaccion); // Agregar al inicio
        localStorage.setItem('transaccionesNovaWear', JSON.stringify(historial));
        
        console.log('💾 Transacción guardada:', transaccion);
    }
    
    // ===== 8. MOSTRAR MODAL =====
    function mostrarModal(titulo, mensaje, icono, detalles, resultado) {
        const modal = document.getElementById('paymentModal');
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalDetails = document.getElementById('modalDetails');
        
        modalIcon.textContent = icono;
        modalTitle.textContent = titulo;
        modalMessage.textContent = mensaje;
        modalDetails.innerHTML = detalles;
        
        // Cambiar color según resultado
        if (resultado === 'approved') {
            modalDetails.style.borderLeft = '4px solid #4CAF50';
        } else if (resultado === 'rejected') {
            modalDetails.style.borderLeft = '4px solid #f44336';
        } else {
            modalDetails.style.borderLeft = '4px solid #ff9800';
        }
        
        modal.style.display = 'flex';
        
        // Configurar cierre
        const closeBtn = document.getElementById('modalCloseBtn');
        const cerrarModal = () => {
            modal.style.display = 'none';
            if (resultado === 'approved') {
                window.location.href = 'carrito.html';
            }
        };
        
        closeBtn.onclick = cerrarModal;
        
        // Cerrar al hacer clic fuera
        modal.onclick = (e) => {
            if (e.target === modal) cerrarModal();
        };
    }
    
    // ===== 9. FORMATO DE TARJETA MIENTRAS ESCRIBES =====
    function setupInputFormats() {
        const cardInput = document.getElementById('cardNumber');
        if (cardInput) {
            cardInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '');
                if (value.length > 16) value = value.slice(0, 16);
                value = value.replace(/(\d{4})/g, '$1 ').trim();
                e.target.value = value;
            });
        }
        
        const expiryInput = document.getElementById('expiryDate');
        if (expiryInput) {
            expiryInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4) value = value.slice(0, 4);
                if (value.length >= 3) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                }
                e.target.value = value;
            });
        }
        
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4) value = value.slice(0, 4);
                e.target.value = value;
            });
        }
    }
    
    // ===== 10. BOTÓN VOLVER =====
    function setupButtons() {
        const backBtn = document.getElementById('backToCart');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.location.href = 'carrito.html';
            });
        }
    }
    
    // ===== 11. INICIALIZAR TODO =====
    function init() {
        const carrito = cargarCarrito();
        renderizarResumen(carrito);
        actualizarBadgeCarrito();
        setupInputFormats();
        setupButtons();
        
        const form = document.getElementById('paymentForm');
        if (form) {
            form.addEventListener('submit', procesarPago);
        }
        
        // Si no hay productos, deshabilitar el botón de pago visualmente
        if (!carrito || carrito.length === 0) {
            const payBtn = document.querySelector('.btn-pagar-ahora');
            if (payBtn) {
                payBtn.disabled = true;
                payBtn.style.opacity = '0.5';
                payBtn.style.cursor = 'not-allowed';
            }
        }
    }
    
    init();
});
