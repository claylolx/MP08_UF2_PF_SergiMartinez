const mysql = require("mysql2");
const dbConfig = require("../config/mysql.config.js");

class Library {
  constructor() {
    // 1. Declaramos la conexión
    this.connection = mysql.createPool({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      database: dbConfig.DB,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    }).promise();
  }

  // Obtener todos los libros
  listAll = async () => {
    try {
      const [results] = await this.connection.query("SELECT * FROM books");
      return results.map(book => ({
        id: book.id,  // Asegurarse de devolver 'id' para ser consistente con MongoDB
        title: book.title,
        author: book.author,
        year: book.year
      }));
    } catch (error) {
      console.error("Error al listar libros:", error);
      throw error;
    }
  };

  // Crear un nuevo libro
  create = async (newBook) => {
    try {
      const [result] = await this.connection.query("INSERT INTO books SET ?", newBook);
      return result.insertId; // Devolver el ID del libro insertado
    } catch (error) {
      console.error("Error al crear libro:", error);
      throw error;
    }
  };

  // Actualizar un libro existente
  update = async (updatedBook) => {
    try {
      const { id, title, author, year } = updatedBook;
      const [result] = await this.connection.query(
        "UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?",
        [title, author, year, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al actualizar libro:", error);
      throw error;
    }
  };

  // Eliminar un libro por ID
  delete = async (id) => {
    try {
      const [result] = await this.connection.query("DELETE FROM books WHERE id = ?", [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar libro:", error);
      throw error;
    }
  };

  // Método para cerrar la conexión (opcional, ya que se usa un pool)
  close = async () => {
    try {
      await this.connection.end();
      console.log("Conexión cerrada correctamente.");
    } catch (error) {
      console.error("Error al cerrar conexión:", error);
    }
  };
}

module.exports = Library;
