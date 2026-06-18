import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyA0plbMuOkjMmNtKpLiSnNVpOkFiWTyRCI",
  authDomain:        "criterion-c---myp-4-term-2.firebaseapp.com",
  projectId:         "criterion-c---myp-4-term-2",
  storageBucket:     "criterion-c---myp-4-term-2.firebasestorage.app",
  messagingSenderId: "612707039062",
  appId:             "1:612707039062:web:bab734cf12e530dc6608f7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
