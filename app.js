const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes.js');

// Instanciación del servidor
const app = express();

// Configurar middleware
app.use(cors());          
app.use(express.json());  
app.use('/', routes);     

// Arranque del servidor
app.listen(5000, () => {
    console.log('server is listening on port 5000');
});
