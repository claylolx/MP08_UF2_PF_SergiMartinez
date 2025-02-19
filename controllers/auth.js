const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../mw/auth.js");
const mysql = require("mysql2/promise");  // Para consultas a la base de datos
const dbConfig = require("../config/mysql.config.js");

// Crear pool de conexiones para mejorar rendimiento
const pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await pool.getConnection();  // Obtener conexión del pool

        // Buscar el usuario en la base de datos
        const [rows] = await connection.execute("SELECT * FROM users WHERE username = ?", [username]);

        connection.release(); // Liberar conexión

        if (rows.length === 0) {
            console.log("Usuario no encontrado:", username);
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

        const user = rows[0];

        console.log("Usuario encontrado:", user);

        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            console.log("Contraseña incorrecta para el usuario:", username);
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

        // Generar token JWT
        const token = generateToken(user.id);
        res.json({ token });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

module.exports = { login };
