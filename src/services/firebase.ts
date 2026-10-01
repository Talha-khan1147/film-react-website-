import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { Platform } from 'react-native';

/**
 * Safe environment variable getter that works in both Vite and Expo/Metro.
 * Vite uses import.meta.env, Metro uses process.env.
 */
function getEnv(key: string): string | undefined {
  try {
    // Vite bundler
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return (import.meta.env as Record<string, string>)[key];
    }
  } catch {
    // import.meta not available (Metro/Node)
  }
  try {
    // Metro / Node bundler
    if (typeof process !== 'undefined' && process.env) {
      return (process.env as Record<string, string>)[key];
    }
  } catch {
    // process not available
  }
  return undefined;
}

/**
 * Firebase Configuration for project: chatting-5b811
 */
export const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY') || "AIzaSyDGdv4zwIwqOnTmxUicRNgoDSZDZaFs19g",
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN') || "chatting-5b811.firebaseapp.com",
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID') || "chatting-5b811",
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || "chatting-5b811.firebasestorage.app",
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || "14039944466",
  appId: getEnv('VITE_FIREBASE_APP_ID') || "1:14039944466:web:9f9f9f20728c57f678f7cb",
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID') || "G-SYF4FHKCR6",
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey) && Boolean(firebaseConfig.projectId);
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | null = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

  if (Platform.OS !== 'web') {
    try {
      const authModule = require('firebase/auth');
      const asyncStorageModule = require('@react-native-async-storage/async-storage');
      const AsyncStorage = asyncStorageModule.default || asyncStorageModule;
      if (authModule.initializeAuth && authModule.getReactNativePersistence) {
        auth = authModule.initializeAuth(app, {
          persistence: authModule.getReactNativePersistence(AsyncStorage),
        });
      } else {
        auth = getAuth(app);
      }
    } catch {
      auth = getAuth(app);
    }
  } else {
    auth = getAuth(app);
  }

  db = getFirestore(app);

  // Initialize Analytics safely in browser environments without throwing errors
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {});
  }
} catch (error) {
  console.warn('Firebase initialization notice:', error);
}

export { app, auth, db, analytics };
