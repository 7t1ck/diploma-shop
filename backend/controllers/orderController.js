const db = require('../config/db');

// POST /api/orders - Створити замовлення
exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { items, delivery_address, delivery_city, phone, notes } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Кошик порожній' });
    }

    if (!delivery_address || !delivery_city || !phone) {
      return res.status(400).json({ success: false, error: 'Заповніть дані доставки' });
    }

    await connection.beginTransaction();

    // Перевіряємо наявність товарів та обчислюємо суму
    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const [products] = await connection.query(
        'SELECT id, name, price, stock_quantity FROM products WHERE id = ? AND is_active = TRUE',
        [item.id]
      );

      if (products.length === 0) {
        await connection.rollback();
        return res.status(400).json({ 
          success: false, 
          error: `Товар з ID ${item.id} не знайдено` 
        });
      }

      const product = products[0];

      if (product.stock_quantity < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ 
          success: false, 
          error: `Недостатньо товару "${product.name}" на складі` 
        });
      }

      totalPrice += parseFloat(product.price) * item.quantity;
      validatedItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Створюємо замовлення
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_price, delivery_address, delivery_city, phone, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, totalPrice, delivery_address, delivery_city, phone, notes || null]
    );

    const orderId = orderResult.insertId;

    // Додаємо позиції замовлення та зменшуємо склад
    for (const item of validatedItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );

      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Замовлення створено',
      orderId,
      totalPrice
    });
  } catch (error) {
    await connection.rollback();
    console.error('Order error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
};

// GET /api/orders/my - Мої замовлення
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await db.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    // Підтягуємо позиції для кожного замовлення
    for (let order of orders) {
      const [items] = await db.query(
        `SELECT 
          oi.*, 
          p.name AS product_name, 
          p.image_url
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/orders - Всі замовлення (manager / admin)
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT 
        o.*,
        u.first_name,
        u.last_name,
        u.email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    for (let order of orders) {
      const [items] = await db.query(
        `SELECT 
          oi.*, 
          p.name AS product_name, 
          p.image_url
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/orders/:id/status - Зміна статусу
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Невірний статус' });
    }

    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Замовлення не знайдено' });
    }

    res.json({ success: true, message: 'Статус оновлено' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};