import express from "express";
import { addUser, getAllUsers, login } from "../controllers/user.js";

const router = express.Router();

// התחברות למערכת: אימות אימייל וסיסמה (באמצעות bcrypt)
router.post("/login", login);

// קבלת כל המשתמשים: שליפת רשימת המשתמשים הרשומים מהמסד
router.get("/", getAllUsers);

// הרשמת משתמש חדש: יצירת חשבון והצפנת הסיסמה לפני השמירה
router.post("/", addUser);

export default router;