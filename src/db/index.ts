import mysql from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  mysqlPool?: mysql.Pool;
  mysqlDb?: MySql2Database<typeof schema>;
};

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());
}

export function getDb(): MySql2Database<typeof schema> | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;

  if (!globalForDb.mysqlPool) {
    globalForDb.mysqlPool = mysql.createPool({
      uri: url,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 5,
      idleTimeout: 60000,
    });
  }

  if (!globalForDb.mysqlDb) {
    globalForDb.mysqlDb = drizzle(globalForDb.mysqlPool, {
      schema,
      mode: "default",
    });
  }

  return globalForDb.mysqlDb;
}

export { schema };
