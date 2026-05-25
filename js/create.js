const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    const nombreCompleto = nombre + " " + apellidos;

    try {
        if (!nombre || !apellidos || !correo || !contrasena) {
            alert("Completa todos los campos");
            return;
        }

        // 🔥 CORREGIDO: Ahora le envía los datos directamente a tu backend en internet (Railway)
        const respuesta = await fetch("https://novawear-production.up.railway.app/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombreCompleto,
                correo,
                contrasena
            })
        });

        const data = await respuesta.json();

        if (data.success) {
            alert("Cuenta creada correctamente");
            
            // 🔥 CORREGIDO: Te lleva directo a la página principal en internet
            window.location.href = "/index.html";
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.log(error);
        alert("Error de conexión con el servidor");
    }
});
