// js/home.js

// Datos de productos del index (6 productos)
const productosIndex = [
    { id: 1, nombre: 'Camiseta Polo Azul', precio: '$55,999 COP', imagen: 'img/Camiseta estilo polo.jpg' },
    { id: 2, nombre: 'Chaqueta tipo Bomber Oversize en Cuero', precio: '$250,000 COP', imagen: 'img/ChaquetadecueroOversize.jpg' },
    { id: 3, nombre: 'Traje Sastre Moderno (Chaleco + Palazzo)', precio: '$249,900 COP', imagen: 'img/Conjuntonegro.webp' },
    { id: 4, nombre: 'Gabán Elegante de Paño con Doble Botonadura', precio: '$190,000 COP', imagen: 'img/Gabanbeige.webp' },
    { id: 5, nombre: 'Vestido de broderie', precio: '$180,000 COP', imagen: 'img/Vestidodebroderie.jpg' },
    { id: 6, nombre: 'Chaqueta de Mezclilla Vintage con Bolsillos Cargo', precio: '$149,400 COP', imagen: 'img/Chaqueta Denim.webp' }
];

// Función para manejar favoritos en index
function handleFavoritoIndex(btn, productId) {
    const producto = productosIndex.find(p => p.id === productId);
    if (producto) {
        toggleFavorito(btn, producto);
    }
}

// Inicializar index
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorFavoritos();
    
    // Sincronizar corazones al cargar
    productosIndex.forEach(producto => {
        const card = document.querySelector(`.product-card[data-product-id="${producto.id}"]`);
        if (card) {
            const heartBtn = card.querySelector('.heart-btn');
            if (heartBtn && esFavorito(producto.id)) {
                heartBtn.classList.add('liked');
                heartBtn.setAttribute('aria-pressed', 'true');
            }
        }
    });
    
    // Evento para botones de agregar al carrito
    document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            alert('Producto agregado al carrito');
        });
    });
