import pg from "pg";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // Enable SSL automatically for Supabase/Postgres cloud URLs which require it.
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase.co')
    ? { rejectUnauthorized: false }
    : undefined
});

export async function q(text, params) {
  return pool.query(text, params);
}

// If this file is executed directly, run a quick connectivity check.
if (process.argv[1] && process.argv[1].endsWith('src/check-db.js')) {
  (async () => {
    try {
      const res = await pool.query('SELECT 1 AS ok');
      console.log('DB OK', res.rows);
    } catch (err) {
      console.error('DB ERROR', err);
      process.exitCode = 1;
    } finally {
      await pool.end();
    }
  })();
}
