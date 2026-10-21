import { pool } from "../config/db.js";

// --- ניהול מוצרים כללי ---

// שליפת כל המוצרים מהמסד
export async function getAllProducts(req, res) {
  try {
    const [products] = await pool.query("SELECT * FROM products");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// שליפת מוצר בודד לפי ID
export async function getProductById(req, res) {
  try {
    const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (product.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(product[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// --- שליפת נתונים לפי קטגוריות (עבור ה-Frontend) ---

// קטגוריה 1: שליפת גדלים וטעמים לגלידת שמנת
export async function getIceCreamData(req, res) {
  try {
    const [sizes] = await pool.query("SELECT * FROM products WHERE category_id = 1 AND sub_type = 'גודל'");
    const [flavors] = await pool.query("SELECT * FROM products WHERE category_id = 1 AND sub_type = 'טעם'");
    res.json({ sizes, flavors });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// קטגוריה 2: שליפת גדלים ותוספות ליוגורט
export async function getYogurtData(req, res) {
  try {
    const [sizes] = await pool.query("SELECT * FROM products WHERE category_id = 2 AND sub_type = 'גודל'");
    const [toppings] = await pool.query("SELECT * FROM products WHERE category_id = 2 AND (sub_type = 'תוספת' OR sub_type = 'רוטב')");
    res.json({ sizes, toppings });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// קטגוריה 3: שליפת גדלים, בסיסים ופירות לפרוזן יוגורט
export async function getFrozenData(req, res) {
  try {
    const [sizes] = await pool.query("SELECT * FROM products WHERE category_id = 3 AND sub_type = 'גודל'");
    const [bases] = await pool.query("SELECT * FROM products WHERE category_id = 3 AND sub_type = 'טעם'");
    const [fruits] = await pool.query("SELECT * FROM products WHERE category_id = 3 AND sub_type = 'תוספת'");
    res.json({ sizes, bases, fruits });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// קטגוריה 4: שליפת גדלים ותוספות לגלידה אמריקאית
export async function getAmericanData(req, res) {
  try {
    const [sizes] = await pool.query("SELECT * FROM products WHERE category_id = 4 AND sub_type = 'גודל'");
    const [extras] = await pool.query("SELECT * FROM products WHERE category_id = 4 AND (sub_type = 'תוספת' OR sub_type = 'רוטב')");
    res.json({ sizes, extras });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// קטגוריה 5: שליפת בסיסים ותוספות למתוקים (וופל/קרפ)
export async function getSweetsData(req, res) {
  try {
    const [bases] = await pool.query("SELECT * FROM products WHERE category_id = 5 AND sub_type = 'גודל'");
    const [toppings] = await pool.query("SELECT * FROM products WHERE category_id = 5 AND (sub_type = 'רוטב' OR sub_type = 'תוספת')");
    res.json({ bases, toppings });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// קטגוריה 6: שליפת כל סוגי השתייה
export async function getDrinksData(req, res) {
  try {
    const [drinks] = await pool.query("SELECT * FROM products WHERE category_id = 6");
    res.json(drinks);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// --- פונקציות ניהול (CRUD) ---

// הוספת מוצר חדש למסד הנתונים
export async function addProduct(req, res) {
  try {
    const { name, price, category_id, image_url, sub_type, description } = req.body; 
    const [result] = await pool.query(
      "INSERT INTO products (name, price, category_id, image_url, sub_type, description) VALUES (?,?,?,?,?,?)",
      [name, price, category_id, image_url || null, sub_type || 'גודל', description || null]
    );
    res.status(201).json({ id: result.insertId, name, price, sub_type, category_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// עדכון פרטי מוצר קיים לפי ID
export async function updateProduct(req, res) {
  try {
    const { name, price, category_id, image_url, sub_type, description } = req.body;
    const { id } = req.params;
    await pool.query(
      "UPDATE products SET name=?, price=?, category_id=?, image_url=?, sub_type=?, description=? WHERE id=?",
      [name, price, category_id, image_url, sub_type, description, id]
    );
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// מחיקת מוצר מהמסד לפי ID
export async function deleteProductById(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}