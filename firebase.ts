import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ------------------------------------------------------------------
// REPLACE THIS CONFIG OBJECT WITH YOUR OWN FIREBASE PROJECT CONFIG
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBwPGVm9Dq0p0rIMvBavdoGdpy0olaePw8",
  authDomain: "vaultdrive-3c6f1.firebaseapp.com",
  projectId: "vaultdrive-3c6f1",
  storageBucket: "vaultdrive-3c6f1.firebasestorage.app",
  messagingSenderId: "31841773888",
  appId: "1:31841773888:web:f04889dcaf99d31512b2a5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
