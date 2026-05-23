const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hola1234",
    database: "novawear"
});

db.connect((err) => {
    if (err) {
        console.log("Error de conexión:", err);
    } else {
        console.log("Conectado a MySQL");
    }
});


// ================= LOGIN =================

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
            res.json({
                success: true,
                mensaje: "Login exitoso"
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

            res.json({
                success: true
            });

        });

    });

});


// ================= PRODUCTOS (NUEVO) =================


// 🔥 OBTENER TODOS LOS PRODUCTOS (INDEX)
app.get("/productos", (req, res) => {

    const sql = "SELECT * FROM productos";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error al obtener productos"
            });
        }

        res.json(result);
    });
});


// 🔥 OBTENER UN PRODUCTO POR ID (PRODUCTO.HTML)
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


// ================= PUERTO =================

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});