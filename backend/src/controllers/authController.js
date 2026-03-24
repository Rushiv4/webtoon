const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebaseAdmin');
const { findUserByEmail, findUserByUsername, createUser, findUserById, findUserByFirebaseUid, createFirebaseUser } = require('../models/userModel');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const emailExists = await findUserByEmail(email);
    if (emailExists) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const usernameExists = await findUserByUsername(username);
    if (usernameExists) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const userId = await createUser(username, email, password_hash);

    res.status(201).json({
      id: userId,
      username,
      email,
      role: 'user',
      token: generateToken(userId, 'user'),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const firebaseLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await findUserByFirebaseUid(uid);

    if (!user) {
      // Check if user already exists with this email (e.g. registered locally first)
      user = await findUserByEmail(email);

      if (user) {
        // Link the existing local account with Firebase
        // NOTE: You could add a 'linkAccount' model function, but for now we'll just return the JWT
        // Or update the user's firebase_uid
        await pool.execute('UPDATE users SET firebase_uid = ?, auth_provider = ? WHERE id = ?', [uid, 'google', user.id]);
        user.firebase_uid = uid;
        user.auth_provider = 'google';
      } else {
        // Create new Firebase user
        const username = name || email.split('@')[0];
        const userId = await createFirebaseUser(username, email, uid, 'google');
        user = { id: userId, username, email, role: 'user' };
      }
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error('Firebase Login Error:', error);
    res.status(401).json({ message: 'Invalid Firebase ID token' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, firebaseLogin };
