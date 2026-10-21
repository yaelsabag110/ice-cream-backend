import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// טעינת משתני סביבה (פורט, פרטי בסיס נתונים וכו')
dotenv.config({ path: "./config/.env" });

// ייבוא נתיבי הגישה (Routes) עבור כל ישות
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";

const app = express();

// --- Middleware ---
// מאפשר גישה מהדפדפן (React) לשרת
app.use(cors());
// מאפשר לשרת לקרוא ולקבל מידע בפורמט JSON מה-Body של הבקשה
app.use(express.json());

// --- הגדרת הנתיבים הראשיים של ה-API ---
app.use("/api/users", userRoutes);     // ניהול משתמשים
app.use("/api/products", productRoutes); // ניהול מוצרים וקטגוריות
app.use("/api/orders", orderRoutes);     // ניהול הזמנות וטבלאות קישור

// נתיב בדיקה בסיסי לוודא שהשרת עובד
app.get("/", (req, res) => {
  res.send("Ice Cream Shop API is running...");
});

// הפעלת השרת על הפורט שהוגדר ב-.env או על 5000 כברירת מחדל
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});