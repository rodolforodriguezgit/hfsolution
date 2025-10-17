// backend/scripts/init-db.js
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'mi_base'
});

async function initializeDatabase() {
  try {
    console.log('🔌 Conectando a PostgreSQL...');
    await client.connect();
    
    // Crear tablas si no existen
    console.log('📝 Creando tabla categories...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      )
    `);

    console.log('📝 Creando tabla products...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        image VARCHAR(500),
        rating_rate DECIMAL(3,2),
        rating_count INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Verificar si las tablas ya tienen datos
    const productsCountResult = await client.query('SELECT COUNT(*) FROM products');
    const rowCount = parseInt(productsCountResult.rows[0].count);
    const categoriesCountResult = await client.query('SELECT COUNT(*) FROM categories');
    const categoriesCount = parseInt(categoriesCountResult.rows[0].count);

    if (rowCount === 0) {
      // Leer el archivo seed.json
      console.log('🌱 Poblando base de datos con datos iniciales...');
      const seedPath = path.join(__dirname, '../seed_products.json');
      const seedRaw = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      const { categories = [], products = [] } = seedRaw;

      // Insertar categorías (respetando ids si vienen)
      for (const cat of categories) {
        if (cat.id != null) {
          await client.query(
            `INSERT INTO categories (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
            [cat.id, cat.name]
          );
        } else {
          await client.query(
            `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
            [cat.name]
          );
        }
      }

      // Insertar productos; si el seed trae id explícito, respetarlo
      for (const product of products) {
        const categoryId = product.category_id ?? product.categoryId ?? null;
        
        if (product.id != null) {
          await client.query(
            `INSERT INTO products (id, title, price, description, category_id, image, rating_rate, rating_count)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              product.id,
              product.title,
              product.price,
              product.description,
              categoryId,
              product.image,
              product.rating?.rate ?? null,
              product.rating?.count ?? null
            ]
          );
        } else {
          await client.query(
            `INSERT INTO products (title, price, description, category_id, image, rating_rate, rating_count)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              product.title,
              product.price,
              product.description,
              categoryId,
              product.image,
              product.rating?.rate ?? null,
              product.rating?.count ?? null
            ]
          );
        }
      }

      // No hay backfill necesario ya que solo guardamos category_id

      console.log(`✅ Insertadas ${categories.length} categorías y ${products.length} productos (con backfill de category_id si aplicaba)`);
      // Sincronizar secuencia de products
      const maxProd = await client.query(`SELECT MAX(id) AS max FROM products`);
      if (!maxProd.rows[0].max) {
        await client.query(`SELECT setval(pg_get_serial_sequence('products','id'), 1, false)`);
      } else {
        await client.query(`SELECT setval(pg_get_serial_sequence('products','id'), $1, true)`, [maxProd.rows[0].max]);
      }

      // Sincronizar secuencia de categories
      const maxCat = await client.query(`SELECT MAX(id) AS max FROM categories`);
      if (!maxCat.rows[0].max) {
        await client.query(`SELECT setval(pg_get_serial_sequence('categories','id'), 1, false)`);
      } else {
        await client.query(`SELECT setval(pg_get_serial_sequence('categories','id'), $1, true)`, [maxCat.rows[0].max]);
      }
    } else {
      // Si ya había productos, aún así aseguramos sembrar categorías si están vacías
      if (categoriesCount === 0) {
        console.log('🌱 Sembrando categorías porque la tabla estaba vacía...');
        const seedPath = path.join(__dirname, '../seed_products.json');
        const seedRaw = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
        const { categories = [] } = seedRaw;
        for (const cat of categories) {
          if (cat.id != null) {
            await client.query(
              `INSERT INTO categories (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
              [cat.id, cat.name]
            );
          } else {
            await client.query(
              `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
              [cat.name]
            );
          }
        }

        // No hay backfill necesario ya que solo guardamos category_id
      } else {
        console.log(`📊 La base de datos ya tiene ${rowCount} productos y ${categoriesCount} categorías, omitiendo inserción`);
      }

      // Asegurar que las secuencias estén sincronizadas incluso si ya había datos
      const maxProd2 = await client.query(`SELECT MAX(id) AS max FROM products`);
      if (!maxProd2.rows[0].max) {
        await client.query(`SELECT setval(pg_get_serial_sequence('products','id'), 1, false)`);
      } else {
        await client.query(`SELECT setval(pg_get_serial_sequence('products','id'), $1, true)`, [maxProd2.rows[0].max]);
      }

      const maxCat2 = await client.query(`SELECT MAX(id) AS max FROM categories`);
      if (!maxCat2.rows[0].max) {
        await client.query(`SELECT setval(pg_get_serial_sequence('categories','id'), 1, false)`);
      } else {
        await client.query(`SELECT setval(pg_get_serial_sequence('categories','id'), $1, true)`, [maxCat2.rows[0].max]);
      }
    }

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

initializeDatabase();