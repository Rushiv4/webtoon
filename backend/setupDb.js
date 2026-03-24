const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const setupDatabase = async () => {
  try {
    // First connect without database selected to create it if not exists
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    const sqlFilePath = path.join(__dirname, 'database.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Executing database setup script...');
    await connection.query(sqlScript);
    console.log('Database and tables created successfully with dummy data.');

    await connection.end();
  } catch (err) {
    console.error('Error setting up database:', err);
  }
};

setupDatabase();
