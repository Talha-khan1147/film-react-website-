import { User, CurrentUserProfile } from '../types/user';

// Clean dynamic defaults - zero hardcoded mock users
export const currentUser: CurrentUserProfile = {
  id: '',
  name: '',
  username: '',
  avatar: '',
  status: 'offline',
  statusMessage: '',
  bio: '',
  isVerified: false,
  settings: {
    notificationsEnabled: true,
    readReceipts: true,
    onlineStatusVisible: true,
    soundEnabled: true,
  },
};

export const contacts: User[] = [];
export const allUsers: User[] = [];

export const getUserById = (id: string): User | undefined => {
  return allUsers.find((u) => u.id === id);
};
