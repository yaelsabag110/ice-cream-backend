import mysql from "mysql2/promise";
import dotenv from "dotenv";

// טעינת משתני סביבה
dotenv.config({ path: "./config/.env" });

// יצירת ה-Pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// בדיקת חיבור בסיסית בעליית השרת (אופציונלי אך מומלץ מאוד)
pool.getConnection()
  .then(connection => {
    console.log(`✅ Connected to database: ${process.env.DB_NAME}`);
    connection.release(); // שחרור החיבור בחזרה ל-Pool
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err.message);
  });

// בדיקה בטוחה (בלי להדפיס סיסמה)
console.log("DB Config Loaded for user:", process.env.DB_USER);