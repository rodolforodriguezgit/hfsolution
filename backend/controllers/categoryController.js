// backend/controllers/categoryController.js
const Category = require('../models/Category');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error en getAllCategories:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al obtener categorías'
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Categoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error en getCategoryById:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'El nombre de la categoría es requerido'
      });
    }

    // Verificar si ya existe una categoría con ese nombre
    const existingCategory = await Category.findByName(name.trim());
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        error: 'Ya existe una categoría con ese nombre'
      });
    }

    const category = await Category.create({ name: name.trim() });
    
    res.status(201).json({
      success: true,
      data: category,
      message: 'Categoría creada exitosamente'
    });
  } catch (error) {
    console.error('Error en createCategory:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al crear categoría'
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'El nombre de la categoría es requerido'
      });
    }

    // Verificar si la categoría existe
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Categoría no encontrada'
      });
    }

    // Verificar si ya existe otra categoría con ese nombre
    const duplicateCategory = await Category.findByName(name.trim());
    if (duplicateCategory && duplicateCategory.id !== parseInt(id)) {
      return res.status(409).json({
        success: false,
        error: 'Ya existe una categoría con ese nombre'
      });
    }

    const category = await Category.update(id, { name: name.trim() });
    
    res.json({
      success: true,
      data: category,
      message: 'Categoría actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error en updateCategory:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al actualizar categoría'
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la categoría existe
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Categoría no encontrada'
      });
    }

    const category = await Category.delete(id);
    
    res.json({
      success: true,
      data: category,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error en deleteCategory:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al eliminar categoría'
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
