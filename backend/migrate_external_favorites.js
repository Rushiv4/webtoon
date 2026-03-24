const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  await db.execute(
    `CREATE TABLE IF NOT EXISTS external_favorites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      external_id VARCHAR(100) NOT NULL,
      title VARCHAR(255) NOT NULL,
      cover_url VARCHAR(500),
      source VARCHAR(50) DEFAULT 'mangadex',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_ext (user_id, external_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  );

  console.log('external_favorites table created!');
  await db.end();
}

migrate().catch(e => { console.error(e.message); process.exit(1); });
