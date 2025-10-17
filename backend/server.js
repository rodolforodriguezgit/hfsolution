// backend/server.js
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
connectDB().then(() => {
  console.log('✅ Base de datos conectada, ejecutando seed...');
  require('./scripts/init-db.js');
});

// Rutas principales
app.use('/products', require('./routes/productRoutes'));
app.use('/category', require('./routes/categoryRoutes'));


// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a la API de Mi Tienda',
    version: '1.0.0',
    endpoints: {
      products: '/products',
      categories: '/category',
      health: '/health'
    }
  });
});



// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
  console.log(`📍 Products: http://localhost:${PORT}/products`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
});