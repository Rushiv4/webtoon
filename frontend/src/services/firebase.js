import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQPeOiWKCYQpXoIJ9oTUGzlt9gCMNkojM",
  authDomain: "webtoon-d5c21.firebaseapp.com",
  projectId: "webtoon-d5c21",
  storageBucket: "webtoon-d5c21.firebasestorage.app",
  messagingSenderId: "721832173142",
  appId: "1:721832173142:web:109969cae6c049d1f0e5f7",
  measurementId: "G-2JV7MYLF5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
