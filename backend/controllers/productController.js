const db = require('../config/db');

// GET /api/products - Отримати всі товари (з фільтрами)
exports.getAllProducts = async (req, res) => {
  try {
    const { category, brand, search, minPrice, maxPrice, sort } = req.query;
    
    let query = `
      SELECT 
        p.*,
        c.name AS category_name,
        c.slug AS category_slug,
        b.name AS brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.is_active = TRUE
    `;
    
    const params = [];
    
    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }
    
    if (brand) {
      query += ' AND b.name = ?';
      params.push(brand);
    }
    
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(minPrice);
    }
    
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(maxPrice);
    }
    
    // Сортування
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY p.price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY p.price DESC';
        break;
      case 'name':
        query += ' ORDER BY p.name ASC';
        break;
      default:
        query += ' ORDER BY p.created_at DESC';
    }
    
    const [products] = await db.query(query, params);
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/products/featured - Рекомендовані товари
exports.getFeaturedProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT 
        p.*,
        c.name AS category_name,
        b.name AS brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.is_active = TRUE AND p.is_featured = TRUE
      ORDER BY p.created_at DESC
      LIMIT 8
    `);
    
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/products/:id - Отримати один товар
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.query(`
      SELECT 
        p.*,
        c.name AS category_name,
        c.slug AS category_slug,
        b.name AS brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.id = ? AND p.is_active = TRUE
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Товар не знайдено' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/products - Створити товар (тільки admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, old_price, stock_quantity, image_url, category_id, brand_id, is_featured } = req.body;
    
    if (!name || !price || !category_id || !brand_id) {
      return res.status(400).json({ success: false, error: 'Заповніть обов\'язкові поля' });
    }
    
    const [result] = await db.query(`
      INSERT INTO products (name, description, price, old_price, stock_quantity, image_url, category_id, brand_id, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, description, price, old_price || null, stock_quantity || 0, image_url, category_id, brand_id, is_featured || false]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Товар створено',
      productId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/products/:id - Оновити товар
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, old_price, stock_quantity, image_url, category_id, brand_id, is_featured, is_active } = req.body;
    
    const [result] = await db.query(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, old_price = ?, stock_quantity = ?, 
          image_url = ?, category_id = ?, brand_id = ?, is_featured = ?, is_active = ?
      WHERE id = ?
    `, [name, description, price, old_price, stock_quantity, image_url, category_id, brand_id, is_featured, is_active, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Товар не знайдено' });
    }
    
    res.json({ success: true, message: 'Товар оновлено' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/products/:id - Видалити товар (soft delete)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query('UPDATE products SET is_active = FALSE WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Товар не знайдено' });
    }
    
    res.json({ success: true, message: 'Товар видалено' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/categories - Отримати всі категорії
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/brands - Отримати всі бренди
exports.getAllBrands = async (req, res) => {
  try {
    const [brands] = await db.query('SELECT * FROM brands ORDER BY name');
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};