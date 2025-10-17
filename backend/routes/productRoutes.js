const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// ✅ RUTA PRINCIPAL - Listar todos los productos
router.get('/', getAllProducts);

// ✅ RUTA OPCIONAL - Por si necesitas después
router.get('/:id', getProductById);

// ✅ CREAR PRODUCTO
router.post('/', createProduct);

// ✅ ACTUALIZAR PRODUCTO
router.put('/:id', updateProduct);

// ✅ ELIMINAR PRODUCTO
router.delete('/:id', deleteProduct);

module.exports = router;