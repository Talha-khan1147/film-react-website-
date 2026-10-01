import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { User, CurrentUserProfile, UserStatus } from '../types/user';

const USERS_COLLECTION = 'users';

export const userService = {
  /**
   * Create or update a user profile in Firestore after Google sign-in.
   * Uses merge so existing fields are preserved.
   */
  async createOrUpdateUserProfile(params: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  }): Promise<CurrentUserProfile> {
    const userRef = doc(db, USERS_COLLECTION, params.uid);
    const existing = await getDoc(userRef);

    if (existing.exists()) {
      // Update last login info
      const profile = existing.data() as CurrentUserProfile;
      await updateDoc(userRef, {
        status: 'online',
        lastSeen: new Date().toISOString(),
        // Update photo/name if changed on Google side
        ...(params.displayName && { name: params.displayName }),
        ...(params.photoURL && { avatar: params.photoURL }),
      });
      return { ...profile, status: 'online' };
    }

    // New user — create profile
    const email = params.email || '';
    const newProfile: CurrentUserProfile = {
      id: params.uid,
      name: params.displayName || email.split('@')[0] || 'User',
      username: (email.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9_]/g, ''),
      avatar: params.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(params.displayName || 'U')}&background=6366F1&color=fff&size=300`,
      status: 'online',
      statusMessage: 'Hey there! I am using AuraChat ✨',
      bio: 'Active on AuraChat',
      email: email,
      isVerified: true,
      settings: {
        notificationsEnabled: true,
        readReceipts: true,
        onlineStatusVisible: true,
        soundEnabled: true,
      },
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  },

  /**
   * Subscribe to all users in real-time (for contacts/search).
   */
  subscribeToUsers(callback: (users: User[]) => void): Unsubscribe {
    const colRef = collection(db, USERS_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      const users: User[] = snapshot.docs
        .map((doc) => ({
          ...(doc.data() as User),
          id: doc.id,
        }))
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      callback(users);
    }, (error) => {
      console.error('Error subscribing to users:', error);
    });
  },

  /**
   * Get a single user by ID.
   */
  async getUserById(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (!userDoc.exists()) return null;
    return { ...(userDoc.data() as User), id: userDoc.id };
  },

  /**
   * Update user profile fields (merge).
   */
  async updateUserProfile(userId: string, updates: Partial<CurrentUserProfile>): Promise<void> {
    await updateDoc(doc(db, USERS_COLLECTION, userId), updates as Record<string, any>);
  },

  /**
   * Update user online status.
   */
  async updateUserStatus(userId: string, status: UserStatus): Promise<void> {
    await updateDoc(doc(db, USERS_COLLECTION, userId), {
      status,
      lastSeen: new Date().toISOString(),
    });
  },
};
