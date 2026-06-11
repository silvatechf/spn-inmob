const express = require('express');
const router = express.Router();
const controller = require('../controllers/propiedades'); // Importamos todo el objeto

// Ahora accedemos mediante controller.nombreFuncion para evitar errores de undefined
router.get('/', controller.getPropiedades);
router.get('/:id', controller.getPropiedadById);
router.post('/', controller.createPropiedad);
router.put('/:id', controller.updatePropiedad);
router.delete('/:id', controller.deletePropiedad);

module.exports = router;