// js/mujer_filtros.js

// Datos de productos de mujer
const productosMujer = [
    { id: 101, nombre: 'Gabán beige minimalista', precio: 289000, precioTexto: '$289,000 COP', imagen: '../img/gaban_beige.png', categoria: 'chaquetas', tallas: ['XS', 'S', 'M', 'L'] },
    { id: 102, nombre: 'Camisa blanca básica', precio: 59000, precioTexto: '$59,000 COP', imagen: '../img/camisa_blanca.jpg', categoria: 'tops', tallas: ['XS', 'S', 'M', 'L', 'XL'] },
    { id: 103, nombre: 'Conjunto negro moderno', precio: 319000, precioTexto: '$319,000 COP', imagen: '../img/conjunto_negro.jpg', categoria: 'pantalones', tallas: ['S', 'M', 'L'] },
    { id: 104, nombre: 'Saco de lana blanco', precio: 199000, precioTexto: '$199,000 COP', imagen: '../img/saco_blanco.jpg', categoria: 'chaquetas', tallas: ['XS', 'S', 'M', 'L', 'XL'] },
    { id: 105, nombre: 'Chaqueta negra oversize', precio: 249000, precioTexto: '$249,000 COP', imagen: '../img/chaqueta_negra_oversize.jpg', categoria: 'chaquetas', tallas: ['S', 'M', 'L', 'XL'] },
    { id: 106, nombre: 'Jogger casual', precio: 129000, precioTexto: '$129,000 COP', imagen: '../img/jogger_casual.png', categoria: 'pantalones', tallas: ['XS', 'S', 'M', 'L', 'XL'] },
    { id: 107, nombre: 'Chaqueta café de cuero', precio: 300000, precioTexto: '$300,000 COP', imagen: '../img/chaqueta_cafe.jpg', categoria: 'chaquetas', tallas: ['S', 'M', 'L'] },
    { id: 108, nombre: 'Camisa de lana', precio: 75000, precioTexto: '$75,000 COP', imagen: '../img/camisa_lana.jpeg', categoria: 'tops', tallas: ['XS', 'S', 'M', 'L'] }
];

// Función para agregar al carrito
function agregarAlCarrito(id, nombre, precio, imagen) {
    console.log('➕ Agregando desde mujer_filtros:', {id, nombre, precio, imagen});
    
    let carrito = JSON.parse(localStorage.getItem('carritoNovaWear') || '[]');
    const existente = carrito.find(item => item.nombre === nombre);
    
    if (existente) {
        existente.cantidad = (existente.cantidad || 1) + 1;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1,
            imagen: imagen
        });
    }
    
    localStorage.setItem('carritoNovaWear', JSON.stringify(carrito));
    
    const badge = document.getElementById('cart-badge');
    if (badge) {
        let total = 0;
        carrito.forEach(item => total += item.cantidad);
        badge.textContent = total;
        badge.style.display = 'flex';
    }
}

// Función para renderizar productos
function renderizarProductos(productos) {
    const grid = document.getElementById('productosGrid');
    if (!grid) return;
    
    if (productos.length === 0) {
        grid.innerHTML = `
            <div class="no-resultados">
                <p>No hay productos que coincidan con los filtros seleccionados.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = productos.map(producto => `
        <div class="product-card" data-product-id="${producto.id}">
            <button class="heart-btn" onclick="handleFavorito(this, {id:${producto.id}, nombre:'${producto.nombre}', precio:'${producto.precioTexto}', imagen:'${producto.imagen}'})" aria-pressed="false">
                <img src="../assets/iconos/favoritos.svg" class="heart-icon">
            </button>
            
            <a href="producto.html?id=${producto.id}" class="product-link">
                <div class="card-img" style="background-image: url('${producto.imagen}')"></div>
                <div class="card-info">
                    <h3>${producto.nombre}</h3>
                    <span class="precio">${producto.precioTexto}</span>
                </div>
            </a>
            
            <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio}, '${producto.imagen}')">AGREGAR AL CARRITO</button>
        </div>
    `).join('');
    
    // Sincronizar corazones de favoritos
    document.querySelectorAll('.heart-btn').forEach(btn => {
        const card = btn.closest('.product-card');
        if (card && card.dataset.productId) {
            if (typeof esFavorito === 'function' && esFavorito(parseInt(card.dataset.productId))) {
                btn.classList.add('liked');
                btn.setAttribute('aria-pressed', 'true');
            }
        }
    });
}

// Función para obtener filtros seleccionados
function obtenerFiltrosSeleccionados() {
    const categorias = Array.from(document.querySelectorAll('input[data-filter="categoria"]:checked')).map(cb => cb.value);
    const tallas = Array.from(document.querySelectorAll('input[data-filter="talla"]:checked')).map(cb => cb.value);
    const precios = Array.from(document.querySelectorAll('input[data-filter="precio"]:checked')).map(cb => cb.value);
    
    return { categorias, tallas, precios };
}

function cumpleFiltroPrecio(precio, rangosPrecio) {
    if (rangosPrecio.length === 0) return true;
    
    return rangosPrecio.some(rango => {
        switch(rango) {
            case '0-50000': return precio < 50000;
            case '50000-100000': return precio >= 50000 && precio <= 100000;
            case '100000-150000': return precio >= 100000 && precio <= 150000;
            case '150000-200000': return precio >= 150000 && precio <= 200000;
            case '200000+': return precio > 200000;
            default: return true;
        }
    });
}

function cumpleFiltroTalla(tallasProducto, tallasSeleccionadas) {
    if (tallasSeleccionadas.length === 0) return true;
    return tallasSeleccionadas.some(talla => tallasProducto.includes(talla));
}

function aplicarFiltros() {
    const { categorias, tallas, precios } = obtenerFiltrosSeleccionados();
    
    const productosFiltrados = productosMujer.filter(producto => {
        if (categorias.length > 0 && !categorias.includes(producto.categoria)) return false;
        if (!cumpleFiltroTalla(producto.tallas, tallas)) return false;
        if (!cumpleFiltroPrecio(producto.precio, precios)) return false;
        return true;
    });
    
    renderizarProductos(productosFiltrados);
}

function limpiarFiltros() {
    document.querySelectorAll('.filtro-checkbox input').forEach(checkbox => {
        checkbox.checked = false;
    });
    renderizarProductos(productosMujer);
}

function actualizarBadgeCarritoLocal() {
    const carrito = JSON.parse(localStorage.getItem('carritoNovaWear') || '[]');
    let total = 0;
    carrito.forEach(item => total += item.cantidad);
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos(productosMujer);
    actualizarBadgeCarritoLocal();
    
    const aplicarBtn = document.getElementById('aplicarFiltrosBtn');
    if (aplicarBtn) aplicarBtn.addEventListener('click', aplicarFiltros);
    
    const limpiarBtn = document.getElementById('limpiarFiltrosBtn');
    if (limpiarBtn) limpiarBtn.addEventListener('click', limpiarFiltros);
    
    if (typeof actualizarContadorFavoritos === 'function') actualizarContadorFavoritos();
});
