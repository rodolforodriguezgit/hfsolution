// backend/controllers/productController.js
const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al obtener productos'
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Producto creado exitosamente'
    });
  } catch (error) {
    console.error('Error en createProduct:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al crear producto'
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Actualizando producto ID:', id);
    console.log('Datos recibidos:', req.body);
    
    const product = await Product.update(id, req.body);
    
    if (!product) {
      console.log('Producto no encontrado con ID:', id);
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    console.log('Producto actualizado exitosamente:', product);
    res.json({
      success: true,
      data: product,
      message: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error en updateProduct:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al actualizar producto: ' + error.message
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Product.getCategories();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error en getCategories:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};


// Eliminar producto por id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: deleted,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al eliminar producto'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  getCategories,
  deleteProduct
};