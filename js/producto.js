// js/producto.js

// Datos de productos
const productos = {
  1: {
    nombre: "Camiseta Polo Azul",
    precio: "$55,999 COP",
    imagen: "../img/Camiseta estilo polo.jpg",
    descripcion: "Camiseta polo azul de algodón suave y corte moderno.",
    categoria: "mujer"
  },
  2: {
    nombre: "Chaqueta tipo Bomber Oversize en Cuero",
    precio: "$250,000 COP",
    imagen: "../img/ChaquetadecueroOversize.jpg",
    descripcion: "Chaqueta de cuero estilo oversize con acabado premium.",
    categoria: "mujer"
  },
  3: {
    nombre: "Traje Sastre Moderno (Chaleco + Palazzo)",
    precio: "$249,900 COP",
    imagen: "../img/Conjuntonegro.webp",
    descripcion: "Traje elegante moderno ideal para ocasiones formales.",
    categoria: "mujer"
  },
  4: {
    nombre: "Gabán Elegante de Paño con Doble Botonadura",
    precio: "$190,000 COP",
    imagen: "../img/Gabanbeige.webp",
    descripcion: "Gabán clásico elegante con doble botonadura.",
    categoria: "mujer"
  },
  5: {
    nombre: "Vestido de broderie",
    precio: "$180,000 COP",
    imagen: "../img/Vestidodebroderie.jpg",
    descripcion: "Vestido ligero de broderie con estilo romántico.",
    categoria: "mujer"
  },
  6: {
    nombre: "Chaqueta de Mezclilla Vintage con Bolsillos Cargo",
    precio: "$149,400 COP",
    imagen: "../img/Chaqueta Denim.webp",
    descripcion: "Chaqueta denim vintage con bolsillos cargo.",
    categoria: "mujer"
  },
  // Productos de hombre para recomendados
  201: {
    nombre: "Camiseta verde oliva",
    precio: "$50,000 COP",
    imagen: "../img/camiseta_verde_oliva.jpg",
    categoria: "hombre"
  },
  202: {
    nombre: "Saco gris",
    precio: "$159,000 COP",
    imagen: "../img/saco_gris.jpg",
    categoria: "hombre"
  },
  203: {
    nombre: "Chaqueta negra",
    precio: "$319,000 COP",
    imagen: "../img/chaqueta_negra_h.jpg",
    categoria: "hombre"
  }
};

// Productos recomendados (IDs)
const productosRecomendados = [2, 3, 5, 201];

// ID del producto actual (se obtiene de la URL)
let currentProductId = null;

// Renderizar productos recomendados
function renderizarRecomendados() {
  const grid = document.getElementById('recomendados-grid');
  if (!grid) return;
  
  const recomendados = productosRecomendados.map(id => productos[id]).filter(p => p);
  
  grid.innerHTML = recomendados.map(producto => `
    <div class="product-card" data-product-id="${getIdByProducto(producto)}">
      <div class="card-img" style="background-image: url('${producto.imagen}')" role="img" aria-label="${producto.nombre}">
        <button class="heart-btn" onclick="toggleRecomendadoFavorito(this, ${getIdByProducto(producto)})" aria-pressed="false" aria-label="Agregar a favoritos">
          <img src="../assets/iconos/favoritos.svg" alt="Agregar a favoritos" class="heart-icon">
        </button>
      </div>
      <div class="card-info">
        <h3>${producto.nombre}</h3>
        <span class="precio">${producto.precio}</span>
        <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${getIdByProducto(producto)})">AGREGAR AL CARRITO</button>
      </div>
    </div>
  `).join('');
  
  // Sincronizar corazones de los recomendados
  productosRecomendados.forEach(id => {
    if (esFavorito(id)) {
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

// Obtener ID del producto por su objeto
function getIdByProducto(producto) {
  for (const [id, p] of Object.entries(productos)) {
    if (p.nombre === producto.nombre && p.precio === producto.precio) {
      return parseInt(id);
    }
  }
  return null;
}

// Toggle favorito para productos recomendados
function toggleRecomendadoFavorito(btn, productId) {
  const producto = productos[productId];
  if (producto) {
    if (btn.classList.contains('liked')) {
      btn.classList.remove('liked');
      btn.setAttribute('aria-pressed', 'false');
      eliminarDeFavoritos(productId);
    } else {
      btn.classList.add('liked');
      btn.setAttribute('aria-pressed', 'true');
      agregarAFavoritos({
        id: productId,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen
      });
    }
  }
}

// Función global para agregar al carrito
function agregarAlCarrito(productId) {
  alert('Producto agregado al carrito');
}

// Esperar a que cargue la página
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  currentProductId = id;
  
  const producto = productos[id];
  
  if (!producto) return;
  
  // Cambiar imagen
  const img = document.querySelector(".producto-img img");
  img.src = producto.imagen;
  img.alt = producto.nombre;
  
  // Cambiar texto
  document.querySelector(".producto-info h1").textContent = producto.nombre;
  document.querySelector(".producto-info .precio").textContent = producto.precio;
  document.querySelector(".producto-info .descripcion").textContent = producto.descripcion;
  
  // Renderizar productos recomendados
  renderizarRecomendados();
  
  // Actualizar contador de favoritos
  actualizarContadorFavoritos();
});
