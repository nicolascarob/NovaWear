const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    try {
        // 🔥 CORREGIDO: Ahora apunta a tu servidor real en Railway
        const respuesta = await fetch("https://novawear-production.up.railway.app/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo,
                contrasena
            })
        });

        const datos = await respuesta.json();

        // Evaluamos success directamente como en el registro
        if (datos.success) {
            alert("Inicio de sesión exitoso");
            
            // 🔥 CORREGIDO: Te redirige directo a la raíz de la tienda en internet
            window.location.href = "/index.html";
        } else {
            alert(datos.mensaje);
        }
        
    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor");
    }
});
