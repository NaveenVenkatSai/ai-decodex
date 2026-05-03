import mysql from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

const pool = global._mysqlPool ?? mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ai_decodex',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

if (process.env.NODE_ENV !== 'production') {
  global._mysqlPool = pool;
}

export default pool;

// Helper to run queries safely
export async function query<T = mysql.RowDataPacket[]>(
  sql: string,
  values?: unknown[]
): Promise<T> {
  const [rows] = await pool.execute(sql, values);
  return rows as T;
}
