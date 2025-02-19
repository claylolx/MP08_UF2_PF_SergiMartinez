const bcrypt = require("bcryptjs");

const generarHash = async () => {
    const password = "admin123"; // Aquí pon la contraseña que quieres encriptar
    const saltRounds = 10; // Nivel de seguridad del hash
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log("Contraseña encriptada:", hashedPassword);
};

generarHash();
