import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("Database Connection failed: ", err.stack);
  } else {
    console.log("Database Connected at: ", res.rows[0].now);
  }
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
