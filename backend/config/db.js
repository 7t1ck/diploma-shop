const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Перевірка підключення
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Помилка підключення до MySQL:', err.message);
    return;
  }
  console.log('✅ Підключено до MySQL бази даних: techshop');
  connection.release();
});

module.exports = pool.promise();