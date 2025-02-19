-- Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS library;
USE library;

-- Crear la tabla "books"
CREATE TABLE IF NOT EXISTS books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    year INT NOT NULL
);

-- Insertar los datos
INSERT INTO books (title, author, year) VALUES
('Don Quijote de la Mancha', 'Miguel de Cervantes', 1605),
('Moby Dick', 'Herman Melville', 1851),
('Orgullo y Prejuicio', 'Jane Austen', 1813),
('Crimen y Castigo', 'Fyodor Dostoevsky', 1866),
('La Odisea', 'Homero', 800);

-- Crear la tabla "users"
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Insertar un usuario de prueba con contraseña encriptada
INSERT INTO users (username, password) VALUES 
('admin', '$2a$10$ca.n3EG.hYuqKCmsNahJwOqUeZ8fNAh8nxeCwuSOu.gJ9BbzIzhaG');
