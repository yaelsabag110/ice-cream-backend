import express from "express";
import {
  addOrder,
  getAllOrders,
  deleteOrder,
  startOrder
} from "../controllers/order.js";

const router = express.Router();

// יצירת הזמנה חדשה: מקבל userId ומערך מוצרים, מבצע בדיקות תקינות ומכניס לטבלאות
router.post("/", addOrder);

// קבלת רשימת כל ההזמנות: מבצע JOIN כדי להציג את פרטי הלקוח ושמות המוצרים
router.get("/", getAllOrders);

// מחיקת הזמנה: מאפשר למחוק הזמנה לפי ID רק אם הסטטוס שלה עדיין לא "נשלח"
router.delete("/:id", deleteOrder);

// עדכון סטטוס: משנה את מצב ההזמנה ל-TRUE (נשלחה) לפי ה-ID שמתקבל
router.put("/start/:id", startOrder);

export default router;