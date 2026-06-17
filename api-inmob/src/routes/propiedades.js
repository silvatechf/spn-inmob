const express = require('express');
const router = express.Router();
const controller = require('../controllers/propiedades');

// --- AÑADE ESTO PARA DEPURAR ---
console.log("¿Qué hay en el controlador?:", controller);
// -------------------------------

// Si en la consola ves "undefined" o alguna función falta, ahí está el problema.
router.get('/', controller.getPropiedades);
router.get('/:id', controller.getPropiedadById);
router.post('/', controller.createPropiedad);
router.put('/:id', controller.updatePropiedad);
router.delete('/:id', controller.deletePropiedad);

module.exports = router;