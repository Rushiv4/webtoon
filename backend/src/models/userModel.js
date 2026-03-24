const pool = require('../config/db');

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

const createUser = async (username, email, password_hash) => {
  const result = await pool.query(
    "INSERT INTO users (username, email, password_hash, auth_provider) VALUES ($1, $2, $3, 'local') RETURNING id",
    [username, email, password_hash]
  );
  return result.rows[0].id;
};

const findUserByFirebaseUid = async (firebaseUid) => {
  const result = await pool.query('SELECT * FROM users WHERE firebase_uid = $1', [firebaseUid]);
  return result.rows[0];
};

const createFirebaseUser = async (username, email, firebaseUid, authProvider) => {
  const result = await pool.query(
    'INSERT INTO users (username, email, firebase_uid, auth_provider) VALUES ($1, $2, $3, $4) RETURNING id',
    [username, email, firebaseUid, authProvider]
  );
  return result.rows[0].id;
};

const findUserById = async (id) => {
  const result = await pool.query('SELECT id, username, email, role, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  findUserByUsername,
  createUser,
  findUserById,
  findUserByFirebaseUid,
  createFirebaseUser
};
