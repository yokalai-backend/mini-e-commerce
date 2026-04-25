import pool from "@config/db";

// It's a helper modules which it's helps me to make query more simpler, clean and of course safer because it's a generic function.
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
