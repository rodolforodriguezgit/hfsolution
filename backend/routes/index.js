const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a mi API con Node.js y Express 🚀' });
});

module.exports = router;
