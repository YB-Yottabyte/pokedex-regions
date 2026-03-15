require('dotenv').config();
const { Pool } = require('pg');

const useSsl =
  process.env.PGSSL === 'true' ||
  process.env.NODE_ENV === 'production' ||
  (process.env.DATABASE_URL || '').includes('railway.app') ||
  (process.env.DATABASE_URL || '').includes('render.com');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
