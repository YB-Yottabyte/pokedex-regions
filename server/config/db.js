const { Pool } = require('pg');
require('dotenv').config();

const useSsl =
  process.env.PGSSL === 'true' ||
  process.env.NODE_ENV === 'production' ||
  (process.env.DATABASE_URL || '').includes('railway.app');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
