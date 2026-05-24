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
            <div class="card-img" style="background-image: url('${producto.imagen}')">
                <button class="heart-btn" onclick="handleFavorito(this, {id:${producto.id}, nombre:'${producto.nombre}', precio:'${producto.precioTexto}', imagen:'${producto.imagen}'})" aria-pressed="false">
                    <img src="../assets/iconos/favoritos.svg" class="heart-icon">
                </button>
            </div>
            <div class="card-info">
                <h3>${producto.nombre}</h3>
                <span class="precio">${producto.precioTexto}</span>
                <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id})">AGREGAR AL CARRITO</button>
            </div>
        </div>
    `).join('');
    
    // Sincronizar corazones de favoritos
    document.querySelectorAll('.heart-btn').forEach(btn => {
        const card = btn.closest('.product-card');
        if (card && card.dataset.productId) {
            if (esFavorito(parseInt(card.dataset.productId))) {
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

// Función para verificar si un producto cumple con el filtro de precio
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

// Función para verificar si un producto cumple con el filtro de talla
function cumpleFiltroTalla(tallasProducto, tallasSeleccionadas) {
    if (tallasSeleccionadas.length === 0) return true;
    return tallasSeleccionadas.some(talla => tallasProducto.includes(talla));
}

// Función principal para aplicar filtros
function aplicarFiltros() {
    const { categorias, tallas, precios } = obtenerFiltrosSeleccionados();
    
    const productosFiltrados = productosMujer.filter(producto => {
        // Filtro por categoría
        if (categorias.length > 0 && !categorias.includes(producto.categoria)) {
            return false;
        }
        
        // Filtro por talla
        if (!cumpleFiltroTalla(producto.tallas, tallas)) {
            return false;
        }
        
        // Filtro por precio
        if (!cumpleFiltroPrecio(producto.precio, precios)) {
            return false;
        }
        
        return true;
    });
    
    renderizarProductos(productosFiltrados);
}

// Limpiar todos los filtros
function limpiarFiltros() {
    document.querySelectorAll('.filtro-checkbox input').forEach(checkbox => {
        checkbox.checked = false;
    });
    renderizarProductos(productosMujer);
}

// Función para agregar al carrito
function agregarAlCarrito(productId) {
    alert('Producto agregado al carrito');
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Renderizar todos los productos al cargar
    renderizarProductos(productosMujer);
    
    // Evento del botón aplicar filtros
    const aplicarBtn = document.getElementById('aplicarFiltrosBtn');
    if (aplicarBtn) {
        aplicarBtn.addEventListener('click', aplicarFiltros);
    }
    
    // Evento del botón limpiar filtros
    const limpiarBtn = document.getElementById('limpiarFiltrosBtn');
    if (limpiarBtn) {
        limpiarBtn.addEventListener('click', limpiarFiltros);
    }
    
    // Actualizar contador de favoritos
    actualizarContadorFavoritos();
});
