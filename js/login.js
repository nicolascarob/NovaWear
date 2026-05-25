const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    const respuesta = await fetch("http://localhost:3000/login", {

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

    if (datos.mensaje === "Login exitoso") {

        alert("Inicio de sesión exitoso");

        window.location.href = "../index.html";

    } else {

        alert(datos.mensaje);

    }

});
