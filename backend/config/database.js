// backend/config/database.js
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'mi_base'
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL');
    return client;
  } catch (err) {
    console.error('❌ Error conectando a PostgreSQL:', err);
    process.exit(1);
  }
};

module.exports = { client, connectDB };