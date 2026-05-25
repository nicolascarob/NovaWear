// js/producto.js

// ============================================
// BASE DE DATOS DE PRODUCTOS (UNIFICADA)
// ============================================

const productos = {
    // ===== PRODUCTOS DE MUJER (Página principal) =====
    1: {
        id: 1,
        nombre: "Camiseta Polo Azul",
        precio: 55999,
        precioTexto: "$55,999 COP",
        imagen: "../img/Camiseta estilo polo.jpg",
        descripcion: "Camiseta polo azul de algodón suave y corte moderno. Perfecta para un look casual elegante.",
        categoria: "mujer"
    },
    2: {
        id: 2,
        nombre: "Chaqueta tipo Bomber Oversize en Cuero",
        precio: 250000,
        precioTexto: "$250,000 COP",
        imagen: "../img/ChaquetadecueroOversize.jpg",
        descripcion: "Chaqueta de cuero estilo oversize con acabado premium. Ideal para un look urbano y atrevido.",
        categoria: "mujer"
    },
    3: {
        id: 3,
        nombre: "Traje Sastre Moderno (Chaleco + Palazzo)",
        precio: 249900,
        precioTexto: "$249,900 COP",
        imagen: "../img/Conjuntonegro.webp",
        descripcion: "Traje elegante moderno ideal para ocasiones formales. Incluye chaleco y pantalón palazzo.",
        categoria: "mujer"
    },
    4: {
        id: 4,
        nombre: "Gabán Elegante de Paño con Doble Botonadura",
        precio: 190000,
        precioTexto: "$190,000 COP",
        imagen: "../img/Gabanbeige.webp",
        descripcion: "Gabán clásico elegante con doble botonadura. Confeccionado en paño de alta calidad.",
        categoria: "mujer"
    },
    5: {
        id: 5,
        nombre: "Vestido de broderie",
        precio: 180000,
        precioTexto: "$180,000 COP",
        imagen: "../img/Vestidodebroderie.jpg",
        descripcion: "Vestido ligero de broderie con estilo romántico. Perfecto para eventos especiales.",
        categoria: "mujer"
    },
    6: {
        id: 6,
        nombre: "Chaqueta de Mezclilla Vintage con Bolsillos Cargo",
        precio: 149400,
        precioTexto: "$149,400 COP",
        imagen: "../img/Chaqueta Denim.webp",
        descripcion: "Chaqueta denim vintage con bolsillos cargo. Un básico que no puede faltar en tu armario.",
        categoria: "mujer"
    },

    // ===== PRODUCTOS DE MUJER (Página mujer.html) =====
    101: {
        id: 101,
        nombre: "Gabán beige minimalista",
        precio: 289000,
        precioTexto: "$289,000 COP",
        imagen: "../img/gaban_beige.png",
        descripcion: "Un abrigo beige atemporal confeccionado con una mezcla de lana de primera calidad. Presenta un corte holgado y un diseño minimalista para una elegancia natural.",
        categoria: "mujer"
    },
    102: {
        id: 102,
        nombre: "Camisa blanca básica",
        precio: 59000,
        precioTexto: "$59,000 COP",
        imagen: "../img/camisa_blanca.jpg",
        descripcion: "Camisa blanca básica de algodón. Versátil y perfecta para cualquier ocasión.",
        categoria: "mujer"
    },
    103: {
        id: 103,
        nombre: "Conjunto negro moderno",
        precio: 319000,
        precioTexto: "$319,000 COP",
        imagen: "../img/conjunto_negro.jpg",
        descripcion: "Conjunto negro moderno de dos piezas. Elegante y sofisticado.",
        categoria: "mujer"
    },
    104: {
        id: 104,
        nombre: "Saco de lana blanco",
        precio: 199000,
        precioTexto: "$199,000 COP",
        imagen: "../img/saco_blanco.jpg",
        descripcion: "Saco de lana blanco, ideal para climas fríos con un toque de elegancia.",
        categoria: "mujer"
    },
    105: {
        id: 105,
        nombre: "Chaqueta negra oversize",
        precio: 249000,
        precioTexto: "$249,000 COP",
        imagen: "../img/chaqueta_negra_oversize.jpg",
        descripcion: "Chaqueta negra oversize, perfecta para un look casual y cómodo.",
        categoria: "mujer"
    },
    106: {
        id: 106,
        nombre: "Jogger casual",
        precio: 129000,
        precioTexto: "$129,000 COP",
        imagen: "../img/jogger_casual.png",
        descripcion: "Jogger casual cómodo y moderno para el día a día.",
        categoria: "mujer"
    },
    107: {
        id: 107,
        nombre: "Chaqueta café de cuero",
        precio: 300000,
        precioTexto: "$300,000 COP",
        imagen: "../img/chaqueta_cafe.jpg",
        descripcion: "Chaqueta café de cuero genuino. Un clásico que nunca pasa de moda.",
        categoria: "mujer"
    },
    108: {
        id: 108,
        nombre: "Camisa de lana",
        precio: 75000,
        precioTexto: "$75,000 COP",
        imagen: "../img/camisa_lana.jpeg",
        descripcion: "Camisa de lana cálida y elegante. Perfecta para climas fríos.",
        categoria: "mujer"
    },

    // ===== PRODUCTOS DE HOMBRE =====
    201: {
        id: 201,
        nombre: "Camiseta verde oliva",
        precio: 50000,
        precioTexto: "$50,000 COP",
        imagen: "../img/camiseta_verde_oliva.jpg",
        descripcion: "Camiseta verde oliva de algodón suave, ideal para el día a día.",
        categoria: "hombre"
    },
    202: {
        id: 202,
        nombre: "Saco gris",
        precio: 159000,
        precioTexto: "$159,000 COP",
        imagen: "../img/saco_gris.jpg",
        descripcion: "Saco gris elegante para ocasiones formales o de oficina.",
        categoria: "hombre"
    },
    203: {
        id: 203,
        nombre: "Chaqueta negra",
        precio: 319000,
        precioTexto: "$319,000 COP",
        imagen: "../img/chaqueta_negra_h.jpg",
        descripcion: "Chaqueta negra de cuero premium con corte moderno.",
        categoria: "hombre"
    },
    204: {
        id: 204,
        nombre: "Saco tejido",
        precio: 199000,
        precioTexto: "$199,000 COP",
        imagen: "../img/saco_tejido.jpg",
        descripcion: "Saco tejido cálido y elegante, perfecto para climas fríos.",
        categoria: "hombre"
    },
    205: {
        id: 205,
        nombre: "Camiseta blanca",
        precio: 50000,
        precioTexto: "$50,000 COP",
        imagen: "../img/camiseta_blanca.jpg",
        descripcion: "Camiseta blanca básica de algodón. Un esencial en tu armario.",
        categoria: "hombre"
    },
    206: {
        id: 206,
        nombre: "Gabán negro",
        precio: 129000,
        precioTexto: "$129,000 COP",
        imagen: "../img/gaban_negro.jpg",
        descripcion: "Gabán negro elegante, ideal para climas fríos con un toque de estilo.",
        categoria: "hombre"
    },
    207: {
        id: 207,
        nombre: "Camiseta vinotinto",
        precio: 90000,
        precioTexto: "$90,000 COP",
        imagen: "../img/camiseta_vinotinto.jpg",
        descripcion: "Camiseta vinotinto de algodón suave, perfecta para un look casual.",
        categoria: "hombre"
    },
    208: {
        id: 208,
        nombre: "Chaqueta de jean",
        precio: 175000,
        precioTexto: "$175,000 COP",
        imagen: "../img/chaqueta_jean.jpg",
        descripcion: "Chaqueta de jean clásica, un básico que nunca pasa de moda.",
        categoria: "hombre"
    }
};

// ===== PRODUCTOS RECOMENDADOS (Mezcla de mujer y hombre) =====
const productosRecomendados = [2, 3, 5, 202, 205];

// ID del producto actual
let currentProductId = null;

// Función para formatear pesos
function formatearPesos(valor) {
    return new Intl.NumberFormat('es-CO').format(valor);
}

// Función global para agregar al carrito
window.agregarAlCarritoGlobal = function(id, nombre, precio, imagen, cantidad = 1) {
    let carrito = JSON.parse(localStorage.getItem('carritoNovaWear') || '[]');
    const existente = carrito.find(item => item.nombre === nombre);
    
    if (existente) {
        existente.cantidad = (existente.cantidad || 1) + cantidad;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: cantidad,
            imagen: imagen
        });
    }
    
    localStorage.setItem('carritoNovaWear', JSON.stringify(carrito));
    
    // Actualizar badge
    const badge = document.getElementById('cart-badge');
    if (badge) {
        let total = 0;
        carrito.forEach(item => total += item.cantidad);
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
};

// Renderizar productos recomendados
function renderizarRecomendados() {
    const grid = document.getElementById('recomendados-grid');
    if (!grid) {
        console.log('No se encontró el grid de recomendados');
        return;
    }
    
    const recomendados = productosRecomendados.map(id => productos[id]).filter(p => p);
    
    if (recomendados.length === 0) {
        grid.innerHTML = '<p>No hay productos recomendados</p>';
        return;
    }
    
    grid.innerHTML = recomendados.map(producto => {
        return `
            <div class="product-card" data-product-id="${producto.id}">
                <a href="producto.html?id=${producto.id}" class="product-link" style="text-decoration: none; color: inherit;">
                    <div class="card-img" style="background-image: url('${producto.imagen}')" role="img" aria-label="${producto.nombre}">
                        <button class="heart-btn" onclick="event.preventDefault(); event.stopPropagation(); toggleRecomendadoFavorito(this, ${producto.id})" aria-pressed="false" aria-label="Agregar a favoritos">
                            <img src="../assets/iconos/favoritos.svg" alt="Agregar a favoritos" class="heart-icon">
                        </button>
                    </div>
                    <div class="card-info">
                        <h3>${producto.nombre}</h3>
                        <span class="precio">${producto.precioTexto}</span>
                    </div>
                </a>
                <button class="btn-agregar-carrito" onclick="agregarAlCarritoGlobal(${producto.id}, '${producto.nombre}', ${producto.precio}, '${producto.imagen}', 1)">AGREGAR AL CARRITO</button>
            </div>
        `;
    }).join('');
    
    // Sincronizar corazones de los recomendados
    productosRecomendados.forEach(id => {
        if (typeof esFavorito === 'function' && esFavorito(id)) {
            const card = document.querySelector(`.product-card[data-product-id="${id}"]`);
            if (card) {
                const heartBtn = card.querySelector('.heart-btn');
                if (heartBtn) {
                    heartBtn.classList.add('liked');
                    heartBtn.setAttribute('aria-pressed', 'true');
                }
            }
        }
    });
}

// Toggle favorito para productos recomendados
window.toggleRecomendadoFavorito = function(btn, productId) {
    event.preventDefault();
    event.stopPropagation();
    
    const producto = productos[productId];
    if (producto && typeof toggleFavorito === 'function') {
        const productoParaFavorito = {
            id: productId,
            nombre: producto.nombre,
            precio: producto.precioTexto,
            imagen: producto.imagen
        };
        toggleFavorito(btn, productoParaFavorito);
    }
};

// Actualizar badges
function actualizarBadges() {
    const carrito = JSON.parse(localStorage.getItem('carritoNovaWear') || '[]');
    let totalCarrito = 0;
    carrito.forEach(item => totalCarrito += item.cantidad);
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.textContent = totalCarrito;
        cartBadge.style.display = totalCarrito > 0 ? 'flex' : 'none';
    }
    
    const favoritos = JSON.parse(localStorage.getItem('novawear_favoritos') || '[]');
    const favBadge = document.getElementById('favoritos-badge');
    if (favBadge) {
        favBadge.textContent = favoritos.length;
        favBadge.style.display = favoritos.length > 0 ? 'flex' : 'none';
    }
}

// Esperar a que cargue la página
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    currentProductId = id;
    
    const producto = productos[id];
    
    if (!producto) {
        console.log('Producto no encontrado para ID:', id);
        document.querySelector(".producto-info h1").textContent = "Producto no encontrado";
        return;
    }
    
    // Cambiar imagen
    const img = document.querySelector(".producto-img img");
    if (img) img.src = producto.imagen;
    
    // Cambiar texto
    const titulo = document.querySelector(".producto-info h1");
    if (titulo) titulo.textContent = producto.nombre;
    
    const precio = document.querySelector(".producto-info .precio");
    if (precio) precio.textContent = producto.precioTexto;
    
    const descripcion = document.querySelector(".producto-info .descripcion");
    if (descripcion) descripcion.textContent = producto.descripcion;
    
    // Renderizar productos recomendados
    renderizarRecomendados();
    
    // Actualizar badges
    actualizarBadges();
    
    // Actualizar contador de favoritos
    if (typeof actualizarContadorFavoritos === 'function') {
        actualizarContadorFavoritos();
    }
    
    // Verificar si el producto actual está en favoritos
    if (typeof esFavorito === 'function' && esFavorito(parseInt(id))) {
        const favBtn = document.querySelector('.fav-btn');
        if (favBtn) {
            favBtn.classList.add('liked');
            favBtn.setAttribute('aria-pressed', 'true');
        }
    }
});
