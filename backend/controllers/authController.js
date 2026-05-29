const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Генерація JWT токена
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Заповніть обов\'язкові поля' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'Пароль має містити мінімум 6 символів' 
      });
    }

    // Перевірка чи email вже існує
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Користувач з таким email вже існує' 
      });
    }

    // Хешування паролю
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення користувача (за замовчуванням - customer)
    const [result] = await db.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, role) 
       VALUES (?, ?, ?, ?, ?, 'customer')`,
      [email, hashedPassword, first_name, last_name, phone || null]
    );

    const userId = result.insertId;
    const token = generateToken(userId, 'customer');

    res.status(201).json({
      success: true,
      message: 'Реєстрація успішна',
      token,
      user: {
        id: userId,
        email,
        first_name,
        last_name,
        phone,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Невірний формат email' 
    });
  }
    if (phone) {
    const phoneRegex = /^\+?[0-9]{10,13}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ 
        success: false, 
        error: 'Невірний формат телефону' 
      });
    }
  }
  
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Введіть email та пароль' 
      });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Невірний email або пароль' 
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({ 
        success: false, 
        error: 'Акаунт заблоковано' 
      });
    }

    // Перевірка паролю
    // Для тестових користувачів з SQL (паролі не захешовані) - порівнюємо напряму
    let isValid = false;
    if (user.password.startsWith('$2')) {
      // Захешований пароль
      isValid = await bcrypt.compare(password, user.password);
    } else {
      // Тестовий незахешований пароль
      isValid = password === user.password;
    }

    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Невірний email або пароль' 
      });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      message: 'Вхід успішний',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/auth/me - інформація про поточного користувача
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'Користувача не знайдено' });
    }

    res.json({ success: true, user: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};