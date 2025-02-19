const jwt = require('jsonwebtoken');

const SECRET_KEY = "tu_clave_secreta";

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "Token requerido" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "2h" });
};

module.exports = { verifyToken, generateToken };
