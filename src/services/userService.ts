import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  query,
  where,
  limit,
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
   * If user is new, profile is created with isProfileComplete = false
   * so they are prompted to complete account setup.
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
      const data = existing.data() as CurrentUserProfile;
      const isComplete =
        data.isProfileComplete === true ||
        (data.isProfileComplete !== false && !!data.username && !!data.name);

      await updateDoc(userRef, {
        status: 'online',
        lastSeen: new Date().toISOString(),
        ...(params.photoURL && !data.avatar && { avatar: params.photoURL }),
      });

      return {
        ...data,
        id: params.uid,
        status: 'online',
        isProfileComplete: isComplete,
      };
    }

    // New user — create provisional profile awaiting account creation completion
    const email = params.email || '';
    const suggestedUsername = (email.split('@')[0] || 'user')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 20);

    const newProfile: CurrentUserProfile = {
      id: params.uid,
      name: params.displayName || email.split('@')[0] || 'User',
      username: suggestedUsername,
      avatar: params.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(params.displayName || 'U')}&background=6366F1&color=fff&size=300`,
      status: 'online',
      statusMessage: 'Hey there! I am using AuraChat ✨',
      bio: 'Active on AuraChat',
      email: email,
      isVerified: true,
      isProfileComplete: false,
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
   * Checks if a username is available in the database.
   */
  async checkUsernameAvailability(
    username: string,
    currentUserId?: string
  ): Promise<{ available: boolean; error?: string }> {
    const clean = username.trim().toLowerCase();
    if (!clean) {
      return { available: false, error: 'Username is required' };
    }
    if (clean.length < 3) {
      return { available: false, error: 'Username must be at least 3 characters' };
    }
    if (clean.length > 20) {
      return { available: false, error: 'Username cannot exceed 20 characters' };
    }
    if (!/^[a-z0-9_]+$/.test(clean)) {
      return {
        available: false,
        error: 'Only lowercase letters, numbers, and underscores are allowed',
      };
    }

    try {
      const q = query(
        collection(db, USERS_COLLECTION),
        where('username', '==', clean),
        limit(2)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return { available: true };
      }
      const isSelf = snapshot.docs.length === 1 && snapshot.docs[0].id === currentUserId;
      if (isSelf) {
        return { available: true };
      }
      return { available: false, error: `@${clean} is already taken` };
    } catch (err) {
      console.warn('Error checking username uniqueness in Firestore:', err);
      return { available: true };
    }
  },

  /**
   * Completes account setup by saving custom name, username, avatar, and bio to database.
   */
  async completeUserProfile(
    userId: string,
    data: {
      name: string;
      username: string;
      avatar?: string;
      bio?: string;
    }
  ): Promise<CurrentUserProfile> {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const existing = await getDoc(userRef);
    if (!existing.exists()) {
      throw new Error('User record not found in database');
    }

    const trimmedName = data.name.trim();
    const cleanUsername = data.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    const cleanBio = data.bio?.trim() || 'Active on AuraChat';
    const chosenAvatar = data.avatar || existing.data().avatar;

    const updates: Record<string, any> = {
      name: trimmedName,
      username: cleanUsername,
      avatar: chosenAvatar,
      bio: cleanBio,
      statusMessage: cleanBio,
      isProfileComplete: true,
      lastSeen: new Date().toISOString(),
    };

    await updateDoc(userRef, updates);

    const updatedProfile: CurrentUserProfile = {
      ...(existing.data() as CurrentUserProfile),
      ...updates,
      id: userId,
      isProfileComplete: true,
    };

    return updatedProfile;
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
