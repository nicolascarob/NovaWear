document.addEventListener("DOMContentLoaded", () => {
    // 1. Detectamos de qué pantalla viene (?categoria=mujer o ?categoria=hombre)
    const params = new URLSearchParams(window.location.search);
    const seccionOrigen = params.get("categoria") || "mujer"; // Si no viene nada, por defecto mujer

    const selectCategoria = document.getElementById("categoria"); // Tu <select> de interfaz
    const formulario = document.getElementById("form-crear-producto"); // Vinculado a tu ID del HTML

    // Elementos para la carga de imágenes reales de tu HTML
    const inputImagen = document.getElementById('input-imagen');
    const previewContainer = document.getElementById('preview-container');
    const previewText = document.getElementById('preview-text');
    
    let base64Image = ""; // Aquí se guardará la imagen real cuando la subas

    // 2. Si viene de una sección específica, configuramos el select de la interfaz
    if (selectCategoria) {
        selectCategoria.value = seccionOrigen;
        selectCategoria.disabled = true; // Evita que cambien manualmente de sección
    }

    // 3. CAPTURA REAL DE LA IMAGEN: Convierte el archivo seleccionado a Base64 para guardarlo en MySQL
    if (inputImagen) {
        inputImagen.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    base64Image = event.target.result;
                    if (previewContainer) {
                        previewContainer.style.backgroundImage = `url('${base64Image}')`;
                    }
                    if (previewText) {
                        previewText.style.display = 'none'; // Oculta el texto de "Haz clic aquí"
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 4. PROCESAR EL GUARDADO REAL CON FETCH HACIA TU SERVER.JS
    if (formulario) {
        formulario.addEventListener("submit", async (e) => {
            e.preventDefault(); // Detiene recargas de página y bloquea alertas nativas viejas

            // Estructura del objeto con los datos reales capturados de tus inputs
            const nuevaPrenda = {
                nombre: document.getElementById("nombre-producto").value,
                precio: parseInt(document.getElementById("precio-producto").value) || 0,
                descripcion: document.getElementById("descripcion-producto").value,
                imagen: base64Image || "../img/placeholder.jpg", // Usa la subida o un placeholder por defecto
                categoria: seccionOrigen,                         // Guarda 'mujer' u 'hombre' según la URL
                visible_tienda: 0                                 // 0 = Se queda estrictamente en el stock administrativo
            };

            try {
                // Petición HTTP POST real a tu endpoint actualizado en Node.js
                const respuesta = await fetch('http://localhost:3000/api/productos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevaPrenda)
                });

                if (respuesta.ok) {
                    // Redirección obligatoria automática de vuelta al stock de origen de forma limpia
                    window.location.href = `stock-${seccionOrigen}.html`;
                } else {
                    const datosError = await respuesta.json();
                    alert(`Error en el servidor: ${datosError.message || "No se pudo registrar la prenda."}`);
                }

            } catch (error) {
                console.error("Error en la petición de red:", error);
                alert("No se pudo conectar con el servidor. Verifica que tu terminal tenga Node.js corriendo.");
            }
        });
    }
});