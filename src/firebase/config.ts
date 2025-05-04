import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your own Firebase config
const firebaseConfig = {
   apiKey: "AIzaSyDE-0i67Q90EN9B8d6NNTvrAnFFF1gguxs",
  authDomain: "trackr-883b5.firebaseapp.com",
  projectId: "trackr-883b5",
  storageBucket: "trackr-883b5.firebasestorage.app",
  messagingSenderId: "248205623113",
  appId: "1:248205623113:web:d5f28c4351dab9aac5a498",
  measurementId: "G-MPQ7ZXZVH6"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export default firebaseApp;