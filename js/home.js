fetch("http://localhost:3000/productos")
  .then(res => res.json())
  .then(data => {
    const grid = document.querySelector(".grid-cards");

    grid.innerHTML = "";

    data.forEach(p => {
      grid.innerHTML += `
        <div class="product-card">

          <button class="heart-btn">
            <img src="assets/iconos/favoritos.svg">
          </button>

          <a href="pages/producto.html?id=${p.id}" class="product-link">

            <div class="card-img"
              style="background-image: url('${p.imagen}')">
            </div>

            <div class="card-info">
              <h3>${p.nombre}</h3>
              <span class="precio">$${p.precio} COP</span>
            </div>

          </a>

          <button class="btn-agregar-carrito">
            AGREGAR AL CARRITO
          </button>

        </div>
      `;
    });
  });