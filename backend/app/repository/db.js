import mysql from "mysql2/promise";
import * as process from "node:process";

export const database = mysql.createPool({
  host: "hetic_transfer-ro-database-1",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "hetic_transfer",
});

