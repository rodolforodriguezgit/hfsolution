// backend/models/Category.js
const { client } = require('../config/database');

class Category {
  // Obtener todas las categorías
  static async findAll() {
    const result = await client.query(`
      SELECT 
        id,
        name
      FROM categories 
      ORDER BY name
    `);
    return result.rows;
  }

  // Obtener categoría por ID
  static async findById(id) {
    const result = await client.query(`
      SELECT 
        id,
        name
      FROM categories 
      WHERE id = $1
    `, [id]);
    
    return result.rows[0];
  }

  // Crear nueva categoría
  static async create(categoryData = {}) {
    const name = categoryData.name ?? null;
    
    if (!name) {
      throw new Error('El nombre de la categoría es requerido');
    }

    const result = await client.query(`
      INSERT INTO categories (name)
      VALUES ($1) 
      RETURNING 
        id,
        name
    `, [name]);

    return result.rows[0];
  }

  // Actualizar categoría
  static async update(id, categoryData) {
    const name = categoryData.name ?? null;
    
    if (!name) {
      throw new Error('El nombre de la categoría es requerido');
    }

    const result = await client.query(`
      UPDATE categories 
      SET name = $1
      WHERE id = $2 
      RETURNING 
        id,
        name
    `, [name, id]);

    return result.rows[0];
  }

  // Eliminar categoría
  static async delete(id) {
    const result = await client.query(`
      DELETE FROM categories WHERE id = $1 RETURNING 
        id,
        name
    `, [id]);
    return result.rows[0];
  }

  // Verificar si existe categoría por nombre
  static async findByName(name) {
    const result = await client.query(`
      SELECT id, name FROM categories WHERE name = $1
    `, [name]);
    return result.rows[0];
  }
}

module.exports = Category;
