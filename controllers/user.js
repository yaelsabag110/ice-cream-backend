import bcryptjs from "bcryptjs";
import { pool } from "../config/db.js";

// פונקציית הרשמה - יוצרת משתמש חדש ומצפינה סיסמה
export async function addUser(req, res) {
  try {
    const { name, email, password, phone, address } = req.body;

    // בדיקת תקינות בסיסית
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // בדיקה אם המשתמש כבר קיים בבסיס הנתונים
    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // 1. נמשוך את הערך מהקובץ .env
    // אנחנו משתמשים ב-Number() כי מה שבא מה-env מגיע כטקסט, ואנחנו צריכים מספר
    const saltRounds = Number(process.env.HASH_NUMBER) || 10;

    // 2. נשתמש במשתנה שיצרנו במקום במספר הקבוע
    const hash = await bcryptjs.hash(password, saltRounds);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, 'USER')",
      [name, email, hash, phone, address]
    );

    res.status(201).json({ id: result.insertId, name, email, role: "USER" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
}

// פונקציית התחברות - בודקת אימייל וסיסמה מוצפנת
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // שליפת המשתמש לפי המייל
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    // אם המשתמש לא נמצא
    if (!users.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // השוואת הסיסמה שהוקלדה לסיסמה המוצפנת ב-DB
    const match = await bcryptjs.compare(password, users[0].password);

    // אם הסיסמה לא תואמת
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // החזרת פרטי המשתמש ללא הסיסמה (מטעמי אבטחה)
    const { password: _, ...userWithoutPassword } = users[0];
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
}

// פונקציה לקבלת כל המשתמשים (לצורך ניהול)
export async function getAllUsers(req, res) {
  try {
    const [users] = await pool.query("SELECT id, name, email, role, phone, address FROM users");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
}