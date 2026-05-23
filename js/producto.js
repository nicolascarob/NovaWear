const productos = {
  1: {
    nombre: "Camiseta Polo Azul",
    precio: "$55,999 COP",
    imagen: "../img/Camiseta estilo polo.jpg",
    descripcion: "Camiseta polo azul de algodón suave y corte moderno."
  },
  2: {
    nombre: "Chaqueta tipo Bomber Oversize en Cuero",
    precio: "$250,000 COP",
    imagen: "../img/ChaquetadecueroOversize.jpg",
    descripcion: "Chaqueta de cuero estilo oversize con acabado premium."
  },
  3: {
    nombre: "Traje Sastre Moderno (Chaleco + Palazzo)",
    precio: "$249,900 COP",
    imagen: "../img/Conjuntonegro.webp",
    descripcion: "Traje elegante moderno ideal para ocasiones formales."
  },
  4: {
    nombre: "Gabán Elegante de Paño con Doble Botonadura",
    precio: "$190,000 COP",
    imagen: "../img/Gabanbeige.webp",
    descripcion: "Gabán clásico elegante con doble botonadura."
  },
  5: {
    nombre: "Vestido de broderie",
    precio: "$180,000 COP",
    imagen: "../img/Vestidodebroderie.jpg",
    descripcion: "Vestido ligero de broderie con estilo romántico."
  },
  6: {
    nombre: "Chaqueta de Mezclilla Vintage con Bolsillos Cargo",
    precio: "$149,400 COP",
    imagen: "../img/Chaqueta Denim.webp",
    descripcion: "Chaqueta denim vintage con bolsillos cargo."
  }
};

// Esperar a que cargue la página
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

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
});