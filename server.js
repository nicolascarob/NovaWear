const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path"); // Importamos path para manejar las rutas de archivos perfectamente

const app = express();

app.use(cors());
// Aumentamos el límite por si subes imágenes pesadas en base64 desde el PC
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 🔥 ESTA LÍNEA HACE QUE TU INDEX.HTML Y CARPETAS (CSS, JS, IMG) SE VEAN EN INTERNET
app.use(express.static(__dirname));

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect((err) => {
    if (err) {
        console.log("Error de conexión:", err);
    } else {
        console.log("Conectado a MySQL");
    }
});


// ================= LOGIN (MODIFICADO CON ROL DE ADMINISTRADOR) =================

app.post("/login", (req, res) => {
    const { correo, contrasena } = req.body;
    const sql = "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?";

    db.query(sql, [correo, contrasena], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                mensaje: "Error del servidor"
            });
        }

        if (result.length > 0) {
            const usuario = result[0];

            // ⚡ LA MAGIA DE LA OPCIÓN A:
            // Interceptamos el correo que configuraste en la interfaz de Railway
            let elRol = "cliente";
            if (usuario.correo === "admin1@gmail.com") {
                elRol = "admin";
            }

            // Devolvemos el JSON incluyendo el rol dinámico para el frontend
            res.json({
                success: true,
                mensaje: "Login exitoso",
                user: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    role: elRol // Envia 'admin' si coincide con el correo, de lo contrario 'cliente'
                }
            });
        } else {
            res.json({
                success: false,
                mensaje: "Correo o contraseña incorrectos"
            });
        }
    });
});


// ================= CREATE USER =================

app.post("/create", (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    const verificar = "SELECT * FROM usuarios WHERE correo = ?";

    db.query(verificar, [correo], (err, result) => {
        if (err) {
            return res.json({
                success: false,
                message: "Error del servidor"
            });
        }

        if (result.length > 0) {
            return res.json({
                success: false,
                message: "Ese correo ya está registrado"
            });
        }

        const sql = "INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)";

        db.query(sql, [nombre, correo, contrasena], (err) => {
            if (err) {
                return res.json({
                    success: false,
                    message: "No se pudo crear la cuenta"
                });
            }
            res.json({ success: true });
        });
    });
});


// ================= PRODUCTOS =================

// 1. 🟢 OBTENER PRODUCTOS FILTRADOS POR CATEGORÍA (Para stock-mujer.html o stock-hombre.html)
app.get("/api/productos", (req, res) => {
    const { categoria } = req.query; // Captura el parámetro ?categoria=mujer de la URL
    
    let sql = "SELECT * FROM productos";
    let params = [];

    // Si pasas una categoría, filtramos en la base de datos para el administrador
    if (categoria) {
        sql += " WHERE categoria = ?";
        params.push(categoria);
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("❌ Error al obtener productos por categoría:", err);
            return res.status(500).json({
                success: false,
                message: "Error al obtener productos"
            });
        }
        res.json(result);
    });
});


// 2. ➕ GUARDAR NUEVA PRENDA CON CLASIFICACIÓN EXCLUSIVA
app.post("/api/productos", (req, res) => {
    const { nombre, precio, descripcion, imagen, categoria, visible_tienda } = req.body;

    // Incluimos las dos columnas nuevas de MySQL Workbench
    const sql = "INSERT INTO productos (nombre, precio, descripcion, imagen, categoria, visible_tienda) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [nombre, precio, descripcion, imagen, categoria, visible_tienda], (err, result) => {
        if (err) {
            console.error("❌ Error al insertar nueva prenda en MySQL:", err);
            return res.status(500).json({
                success: false,
                message: "Error interno al intentar guardar la nueva prenda"
            });
        }

        console.log(`✅ Prenda guardada con éxito en el stock de: ${categoria.toUpperCase()}`);
        res.status(201).json({
            success: true,
            message: "Prenda registrada exitosamente",
            id: result.insertId
        });
    });
});


// 3. 🛒 RUTA PARA LA TIENDA PÚBLICA (Solo lo que tiene visible_tienda = 1)
app.get("/productos/publicos", (req, res) => {
    const sql = "SELECT * FROM productos WHERE visible_tienda = 1";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error al cargar la tienda"
            });
        }
        res.json(result);
    });
});


// 🔍 OBTENER UN PRODUCTO POR ID (PRODUCTO.HTML)
app.get("/producto/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM productos WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error al obtener producto"
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }
        res.json(result[0]);
    });
});


// ⚡ ACTUALIZAR PRODUCTO DESDE EL PANEL DE ADMINISTRACIÓN
app.put("/api/productos/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, precio, descripcion, imagen } = req.body;

    let sql = "";
    let params = [];

    if (imagen) {
        sql = "UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, imagen = ? WHERE id = ?";
        params = [nombre, precio, descripcion, imagen, id];
    } else {
        sql = "UPDATE productos SET nombre = ?, precio = ?, descripcion = ? WHERE id = ?";
        params = [nombre, precio, descripcion, id];
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error al actualizar la base de datos:", err);
            return res.status(500).json({
                success: false,
                message: "Error interno al intentar guardar los cambios"
            });
        }
        res.json({
            success: true,
            message: "Producto actualizado correctamente en MySQL"
        });
    });
});


// 🗑️ ELIMINAR UNA PRENDA POR ID
app.delete("/api/productos/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM productos WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error al ejecutar el DELETE en MySQL:", err);
            return res.status(500).json({
                success: false,
                message: "Error interno en el servidor al intentar eliminar la prenda"
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró ningún producto con el ID ingresado"
            });
        }
        res.json({
            success: true,
            message: "El producto ha sido borrado exitosamente de MySQL"
        });
    });
});


// 🌐 RUTAS PARA MOSTRAR LAS PÁGINAS DE LA CARPETA /PAGES SIN PROBLEMAS DE RUTA
app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "create.html"));
});

app.get("/login-page", (req, res) => {
    // Le puse "/login-page" a la URL para que no choque con el POST de "/login" que procesa tus datos.
    res.sendFile(path.join(__dirname, "pages", "login.html"));
});


// ================= PUERTO =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
