import mysql, { Pool } from "mysql2/promise";

export class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "nip_db",
      port: Number(process.env.DB_PORT) || 3306,
      connectionLimit: 10,
    });

    console.log("MySQL pool created successfully");
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Execute insert/update/delete
  public async run(sql: string, params: any[] = []): Promise<void> {
    try {
      const conn = await this.pool.getConnection();
      await conn.query(sql, params);
      conn.release();
    } catch (error) {
      console.error("Database query failed:", error);
      throw error;
    }
  }

  // Get a single row
  public async get<T>(sql: string, params: any[] = []): Promise<T | null> {
    const conn = await this.pool.getConnection();
    const [rows] = await conn.query(sql, params);
    conn.release();
    const results = rows as T[];
    return results.length > 0 ? results[0] : null;
  }

  // Get multiple rows
  public async all<T>(sql: string, params: any[] = []): Promise<T[]> {
    const conn = await this.pool.getConnection();
    const [rows] = await conn.query(sql, params);
    conn.release();
    return rows as T[];
  }

  // Test database connection
  public async testConnection(): Promise<boolean> {
    try {
      const conn = await this.pool.getConnection();
      await conn.ping();
      conn.release();
      console.log("MySQL connection test successful");
      return true;
    } catch (error) {
      console.error("MySQL connection test failed:", error);
      return false;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
    console.log("Database connection pool closed");
  }
}

export const db = Database.getInstance();
