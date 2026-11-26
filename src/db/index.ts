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
    const needsSsl =
      url.includes("ssl-mode=REQUIRED") ||
      url.includes("ssl=") ||
      url.includes("aivencloud.com") ||
      url.includes("tidbcloud.com");
    const cleanUri = url
      .replace(/([?&])ssl-mode=[^&]*(&?)/i, (_, p1, p2) =>
        p1 === "?" && p2 ? "?" : p1 === "&" && p2 ? "&" : "",
      )
      .replace(/([?&])ssl=[^&]*(&?)/i, (_, p1, p2) =>
        p1 === "?" && p2 ? "?" : p1 === "&" && p2 ? "&" : "",
      );

    globalForDb.mysqlPool = mysql.createPool({
      uri: cleanUri,
      ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
      connectTimeout: 10000,
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
