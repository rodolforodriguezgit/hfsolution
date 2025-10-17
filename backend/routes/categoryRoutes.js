const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
} = require('../controllers/categoryController');

// ✅ RUTA PRINCIPAL - Listar todas las categorías
router.get('/', getAllCategories);


// ✅ CREAR CATEGORÍA
router.post('/', createCategory);

// ✅ ACTUALIZAR CATEGORÍA
router.put('/:id', updateCategory);



module.exports = router;
