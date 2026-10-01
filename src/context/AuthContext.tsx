import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { CurrentUserProfile } from '../types/user';
import { auth } from '../services/firebase';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

export interface AuthContextType {
  user: CurrentUserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<CurrentUserProfile>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CurrentUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch or create user profile from Firestore
          const profile = await userService.createOrUpdateUserProfile({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          });
          setUser(profile);
          localStorage.setItem('aurachat_auth_session', JSON.stringify(profile));
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Fallback to stored user
          const stored = authService.getStoredUser();
          if (stored) setUser(stored);
        }
      } else {
        setUser(null);
        localStorage.removeItem('aurachat_auth_session');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const googleUser = await authService.loginWithGoogle();
      setUser(googleUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (updates: Partial<CurrentUserProfile>) => {
    const updated = authService.updateProfile(updates);
    if (updated) {
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginWithGoogle,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
