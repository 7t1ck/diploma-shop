const db = require('../config/db');

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [[products]] = await db.query('SELECT COUNT(*) AS count FROM products WHERE is_active = TRUE');
    const [[users]] = await db.query('SELECT COUNT(*) AS count FROM users WHERE role = "customer"');
    const [[orders]] = await db.query('SELECT COUNT(*) AS count FROM orders');
    const [[revenue]] = await db.query('SELECT COALESCE(SUM(total_price), 0) AS total FROM orders WHERE status != "cancelled"');
    const [[newOrders]] = await db.query('SELECT COUNT(*) AS count FROM orders WHERE status = "new"');
    const [[lowStock]] = await db.query('SELECT COUNT(*) AS count FROM products WHERE stock_quantity < 5 AND is_active = TRUE');
    
    const [recentOrders] = await db.query(`
      SELECT o.*, u.first_name, u.last_name 
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        products: products.count,
        users: users.count,
        orders: orders.count,
        revenue: parseFloat(revenue.total),
        newOrders: newOrders.count,
        lowStock: lowStock.count,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, email, first_name, last_name, phone, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/admin/users/:id - оновити роль / блокування
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, is_active } = req.body;
    
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, error: 'Не можна змінювати свій акаунт' });
    }

    const [result] = await db.query(
      'UPDATE users SET role = ?, is_active = ? WHERE id = ?',
      [role, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Користувача не знайдено' });
    }

    res.json({ success: true, message: 'Користувача оновлено' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};