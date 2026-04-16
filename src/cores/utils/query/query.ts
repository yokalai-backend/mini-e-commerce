import pool from "../../config/db";

export async function queryOne<T>(sql: string, values?: unknown[]): Promise<T> {
  const result = await pool.query(sql, values);

  return result.rows[0] as T;
}

export async function queryMany<T>(
  sql: string,
  values?: unknown[],
): Promise<T[] | []> {
  const result = await pool.query(sql, values);

  return result.rows as T[];
}
