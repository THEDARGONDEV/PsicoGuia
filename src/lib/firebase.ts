import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBUNR-r_XnJ6iMENihAFlyC3fpZfV1fPag",
  authDomain: "psicoguia-21947.firebaseapp.com",
  projectId: "psicoguia-21947",
  storageBucket: "psicoguia-21947.firebasestorage.app",
  messagingSenderId: "74065208733",
  appId: "1:74065208733:web:8d15b08dbc37499ede7b74",
  measurementId: "G-JECDRE06P5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with persistent cache and multi-tab support
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

if (typeof window !== 'undefined') {
  getAnalytics(app);
}
