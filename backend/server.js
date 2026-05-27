const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Тестовий маршрут
app.get('/', (req, res) => {
  res.json({ 
    message: 'TechShop API працює',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      auth: '/api/auth',
      cart: '/api/cart',
      orders: '/api/orders'
    }
  });
});

// Тест підключення до БД
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM products');
    res.json({ 
      success: true, 
      message: 'БД працює',
      productsCount: rows[0].count 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Маршрути API
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api', require('./routes/categoryRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Обробка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не знайдено' });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n Сервер запущено: http://localhost:${PORT}`);
  console.log(` API доступне: http://localhost:${PORT}/api\n`);
});