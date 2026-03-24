const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase in many environments
  }
});

pool.connect()
  .then(() => {
    console.log('Connected to Supabase (PostgreSQL) Database');
  })
  .catch((err) => {
    console.error('Error connecting to Supabase:', err);
  });

// Add a helper to match mysql2's .execute() pattern if possible, 
// but it's better to update models to use .query() directly.
module.exports = pool;
