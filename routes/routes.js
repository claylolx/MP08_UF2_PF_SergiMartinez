const express = require('express');
const { getBooks, createBook, updateBook, deleteBook } = require('../controllers/books.js');
const { login } = require('../controllers/auth.js');
const { verifyToken } = require('../mw/auth.js');

const router = express.Router();

router.get('/api/books', getBooks);
router.post('/api/books', verifyToken, createBook);
router.put('/api/books', verifyToken, updateBook);
router.delete('/api/books', verifyToken, deleteBook);

// Ruta de login
router.post('/api/login', login);

module.exports = router;
