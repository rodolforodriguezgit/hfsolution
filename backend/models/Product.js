// backend/models/Product.js
const { client } = require('../config/database');

class Product {
  // Obtener todos los productos
  static async findAll() {
    const result = await client.query(`
      SELECT 
        p.id,
        p.title,
        p.price,
        p.description,
        c.name as category,
        p.category_id as "categoryId",
        p.image,
        p.rating_rate as "ratingRate", 
        p.rating_count as "ratingCount",
        p.created_at as "createdAt"
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id
    `);
    return result.rows;
  }

  // Obtener producto por ID
  static async findById(id) {
    const result = await client.query(`
      SELECT 
        p.id,
        p.title,
        p.price,
        p.description,
        c.name as category,
        p.category_id as "categoryId",
        p.image,
        p.rating_rate as "ratingRate",
        p.rating_count as "ratingCount",
        p.created_at as "createdAt"
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1
    `, [id]);
    
    return result.rows[0];
  }


  // Crear nuevo producto
  static async create(productData = {}) {
    const title = productData.title ?? null;
    const price = productData.price != null ? Number(productData.price) : null;
    const description = productData.description ?? null;
    const category = productData.category ?? null;
    const image = productData.image ?? null;

    const toIntNullable = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? Math.trunc(n) : null;
    };
    const toNumNullable = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    // Resolver categoryId: si viene nombre de categoría, buscar su id
    let categoryId = toIntNullable(productData.category_id ?? productData.categoryId ?? null);
    if (!categoryId && category) {
      const catRes = await client.query(`SELECT id FROM categories WHERE name = $1`, [category]);
      categoryId = catRes.rows[0]?.id ?? null;
    }

    // rating puede venir como objeto o campos planos
    const ratingRate = toNumNullable(productData.rating?.rate ?? productData.rating_rate ?? productData.ratingRate ?? null);
    const ratingCount = toIntNullable(productData.rating?.count ?? productData.rating_count ?? productData.ratingCount ?? null);

    // Opcional: log para depuración
    // console.debug('Normalized product create:', { title, price, description, category, categoryId, image, ratingRate, ratingCount });

    const result = await client.query(`
      INSERT INTO products 
        (title, price, description, category_id, image, rating_rate, rating_count)
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING 
        id,
        title,
        price,
        description,
        (SELECT name FROM categories WHERE id = products.category_id) as category,
        category_id as "categoryId",
        image,
        rating_rate as "ratingRate",
        rating_count as "ratingCount",
        created_at as "createdAt"
    `, [title, price, description, categoryId, image, ratingRate, ratingCount]);

    return result.rows[0];
  }
// ...existing code...
  // Actualizar producto
  static async update(id, productData) {
    try {
      // Verificar que el producto existe primero
      const existingProduct = await client.query('SELECT id FROM products WHERE id = $1', [id]);
      if (existingProduct.rows.length === 0) {
        return null; // Producto no encontrado
      }

      const title = productData.title ?? null;
      const price = productData.price != null ? Number(productData.price) : null;
      const description = productData.description ?? null;
      const image = productData.image ?? null;

      const toIntNullable = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? Math.trunc(n) : null;
      };
      const toNumNullable = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
      };

      // Resolver categoryId: admite category_id, categoryId o nombre en 'category'
      const categoryName = productData.category ?? null;
      let categoryId = toIntNullable(productData.category_id ?? productData.categoryId ?? null);
      if (!categoryId && categoryName) {
        const catRes = await client.query(`SELECT id FROM categories WHERE name = $1`, [categoryName]);
        categoryId = catRes.rows[0]?.id ?? null;
      }

      const ratingRate = toNumNullable(productData.rating?.rate ?? productData.rating_rate ?? productData.ratingRate ?? null);
      const ratingCount = toIntNullable(productData.rating?.count ?? productData.rating_count ?? productData.ratingCount ?? null);

      console.log('Actualizando producto con datos:', { id, title, price, description, categoryId, image, ratingRate, ratingCount });

      const result = await client.query(`
        UPDATE products 
        SET title = $1,
            price = $2,
            description = $3,
            category_id = $4,
            image = $5,
            rating_rate = $6,
            rating_count = $7
        WHERE id = $8 
        RETURNING 
          id,
          title,
          price,
          description,
          (SELECT name FROM categories WHERE id = products.category_id) as category,
          category_id as "categoryId",
          image,
          rating_rate as "ratingRate",
          rating_count as "ratingCount",
          created_at as "createdAt"
      `, [title, price, description, categoryId, image, ratingRate, ratingCount, id]);

      console.log('Resultado de la actualización:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error('Error en Product.update:', error);
      throw error;
    }
  }

  // Eliminar producto
  static async delete(id) {
    const result = await client.query(`
      DELETE FROM products WHERE id = $1 RETURNING *
    `, [id]);
    return result.rows[0];
  }

  // Buscar productos por categoría
  static async findByCategory(category) {
    const result = await client.query(`
      SELECT p.*, c.name as category 
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE c.name = $1 
      ORDER BY p.id
    `, [category]);
    return result.rows;
  }

  // Obtener categorías únicas
  static async getCategories() {
    const result = await client.query(`
      SELECT id, name 
      FROM categories 
      ORDER BY name
    `);
    return result.rows;
  }
}

module.exports = Product;