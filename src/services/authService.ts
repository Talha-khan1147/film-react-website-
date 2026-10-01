import { CurrentUserProfile } from '../types/user';
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from './firebase';
import { userService } from './userService';

const AUTH_STORAGE_KEY = 'aurachat_auth_session';

/**
 * Maps Firebase & Google OAuth error codes to clear, actionable messages.
 */
export function mapFirebaseAuthError(error: any): string {
  const code = error?.code || '';
  const message = error?.message || '';

  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in popup was closed before completing.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/operation-not-allowed':
      return 'Google sign-in is disabled in your Firebase Console. Please enable it under Authentication > Sign-in method.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Console. Add your domain under Authentication > Settings > Authorized domains.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';
    case 'auth/invalid-api-key':
      return 'Invalid Firebase API key. Please check your firebaseConfig credentials.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email address using another login method.';
    case 'auth/too-many-requests':
      return 'Access temporarily disabled due to many failed attempts. Please try again later.';
    default:
      if (message.includes('DEVELOPER_ERROR') || message.includes('code 10')) {
        return 'Android SHA-1 Fingerprint mismatch. Add your SHA-1 key in Firebase Android Project settings.';
      }
      return message || 'Authentication encountered an unexpected error.';
  }
}

export const authService = {
  getStoredUser(): CurrentUserProfile | null {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return null;
  },

  async loginWithGoogle(): Promise<CurrentUserProfile> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Create or update user profile in Firestore
      const profile = await userService.createOrUpdateUserProfile({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      });

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch (err: any) {
      throw new Error(mapFirebaseAuthError(err));
    }
  },

  async logout(): Promise<void> {
    // Update status to offline before signing out
    const current = this.getStoredUser();
    if (current?.id) {
      try {
        await userService.updateUserStatus(current.id, 'offline');
      } catch {
        // ignore
      }
    }

    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  updateProfile(updates: Partial<CurrentUserProfile>): CurrentUserProfile | null {
    const current = this.getStoredUser();
    if (!current) return null;
    const updated: CurrentUserProfile = { ...current, ...updates };

    // Persist to Firestore
    if (current.id) {
      userService.updateUserProfile(current.id, updates).catch(() => {});
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
