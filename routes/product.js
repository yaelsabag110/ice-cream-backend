import express from "express";
import {
  getAllProducts,
  getProductById,
  getIceCreamData,
  getYogurtData,
  getFrozenData,
  getAmericanData,
  getSweetsData,
  getDrinksData,
  addProduct,
  deleteProductById
} from "../controllers/product.js";

const router = express.Router();

// --- נתיבי שליפה לפי קטגוריות (עבור הצגת הנתונים באתר) ---

// שליפת גדלים וטעמים לגלידת שמנת
router.get("/category/1", getIceCreamData);

// שליפת גדלים ותוספות ליוגורט
router.get("/category/2", getYogurtData);

// שליפת גדלים, בסיסים ופירות לפרוזן יוגורט
router.get("/category/3", getFrozenData);

// שליפת גדלים ותוספות לגלידה אמריקאית
router.get("/category/4", getAmericanData);

// שליפת בסיסים ותוספות למתוקים (וופל/קרפ)
router.get("/category/5", getSweetsData);

// שליפת רשימת השתייה הקלה
router.get("/category/6", getDrinksData);

// --- נתיבי ניהול מוצרים (CRUD) ---

// קבלת רשימת כל המוצרים הקיימים במערכת
router.get("/", getAllProducts);

// קבלת פרטי מוצר בודד לפי ה-ID שלו
router.get("/:id", getProductById);

// הוספת מוצר חדש למסד הנתונים
router.post("/", addProduct);

// מחיקת מוצר מהמערכת לפי ID
router.delete("/:id", deleteProductById);

export default router;