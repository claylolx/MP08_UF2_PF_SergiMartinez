const Library = require('../models/Library.js');

const getBooks = async (req, res) => {
    try {
        const library = new Library();
        const books = await library.listAll();
        res.json(books);
        await library.close();
    } catch (error) {
        res.status(500).json("Error al obtener los libros");
    }
};

const createBook = async (req, res) => {
    try {
        const library = new Library();
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
        };
        const id = await library.create(newBook);
        res.json({ message: "Libro creado exitosamente", id });
        await library.close();
    } catch (error) {
        res.status(500).json("Error al crear el libro");
    }
};

const updateBook = async (req, res) => {
    try {
        const library = new Library();
        const updatedBook = {
            id: req.body.id,
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
        };
        const result = await library.update(updatedBook);
        res.json(result ? "Libro actualizado exitosamente" : "Error actualizando el libro");
        await library.close();
    } catch (error) {
        res.status(500).json("Error al actualizar el libro");
    }
};

const deleteBook = async (req, res) => {
    try {
        const library = new Library();
        const id = req.body.id;
        const result = await library.delete(id);
        res.json(result ? "Libro eliminado exitosamente" : "Error eliminando el libro");
        await library.close();
    } catch (error) {
        res.status(500).json("Error al eliminar el libro");
    }
};

module.exports = {
    getBooks,
    createBook,
    updateBook,
    deleteBook,
};
