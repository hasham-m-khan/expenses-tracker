import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as schema from './schema';

// --- DATABASE ----------------------------------------------------------------
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

export const db = drizzle({ 
  client: pool, 
  schema, 
  mode: "default", 
  casing: 'snake_case', 
});
