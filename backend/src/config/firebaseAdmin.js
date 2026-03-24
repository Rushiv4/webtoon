const admin = require('firebase-admin');

// IMPORTANT: These values should be provided in the .env file
// You can get them by generating a new private key in Firebase Console -> Project Settings -> Service Accounts
let privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (privateKey) {
  // Handle escaped newlines
  privateKey = privateKey.replace(/\\n/g, '\n');
  // Remove accidental extra quotes if they exist
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.substring(1, privateKey.length - 1);
  }
}

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: privateKey,
};

if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin initialized');
} else {
  console.warn('Firebase Admin not initialized: Missing environment variables');
}

module.exports = admin;
