import { pool } from "../config/db.js";

// הוספת הזמנה חדשה (כולל הוספה לטבלת הקישור)
export async function addOrder(req, res) {
  const { userId, arr } = req.body;

  try {
    // 1. בדיקה שהמשתמש קיים
    const [users] = await pool.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (!users.length) {
      return res.status(404).json({ message: "User not found" });
    }

    // בדיקה מקדימה שכל המוצרים במערך קיימים במסד הנתונים
    for (let item of arr) {
      const [productExists] = await pool.query("SELECT id FROM products WHERE id = ?", [item.prodId]);
      if (!productExists.length) {
        return res.status(404).json({ message: `Product with id ${item.prodId} not found` });
      }
    }

    // 2. הכנסה לטבלת orders
    const [orderResult] = await pool.query(
      "INSERT INTO orders (user_id, is_sent) VALUES (?, FALSE)",
      [userId]
    );
    const orderId = orderResult.insertId;

    // 3. הכנסה לטבלת product_in_order
    for (let item of arr) {
      await pool.query(
        "INSERT INTO product_in_order (order_id, product_id, quantity) VALUES (?,?,?)",
        [orderId, item.prodId, item.qty]
      );
    }

    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (err) {
    console.error("SQL Error:", err.sqlMessage || err.message);
    res.status(500).json({ message: "SQL Error: " + (err.sqlMessage || err.message) });
  }
}

// שליפת כל ההזמנות עם JOIN 
export async function getAllOrders(req, res) {
  try {
    const [orders] = await pool.query(`
      SELECT 
        o.id AS orderId,
        o.order_date,
        o.is_sent,
        u.name AS userName,
        p.name AS productName,
        p.price,
        poi.quantity AS qty
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN product_in_order poi ON o.id = poi.order_id
      JOIN products p ON poi.product_id = p.id
      ORDER BY o.order_date DESC
    `);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
}

// מחיקת הזמנה (רק אם לא יצאה לדרך)
export async function deleteOrder(req, res) {
  try {
    const [orders] = await pool.query("SELECT is_sent FROM orders WHERE id = ?", [req.params.id]);
    
    if (!orders.length) return res.status(404).json({ message: "Order not found" });
    if (orders[0].is_sent) return res.status(403).json({ message: "Cannot delete order that was already sent" });

    // שימוש בשם טבלה אחיד: product_in_order
    await pool.query("DELETE FROM product_in_order WHERE order_id = ?", [req.params.id]);
    await pool.query("DELETE FROM orders WHERE id = ?", [req.params.id]);

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order" });
  }
}

// עדכון סטטוס הזמנה ל"יצאה לדרך"
export async function startOrder(req, res) {
  try {
    await pool.query("UPDATE orders SET is_sent = TRUE WHERE id = ?", [req.params.id]);
    res.json({ message: "Order marked as sent" });
  } catch (err) {
    res.status(500).json({ message: "Error updating order" });
  }
}