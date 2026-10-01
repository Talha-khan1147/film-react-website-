export type UserStatus = 'online' | 'offline' | 'away';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: UserStatus;
  statusMessage?: string;
  bio: string;
  lastSeen?: string;
  phoneNumber?: string;
  email?: string;
  isVerified?: boolean;
}

export interface CurrentUserProfile extends User {
  settings: {
    notificationsEnabled: boolean;
    readReceipts: boolean;
    onlineStatusVisible: boolean;
    soundEnabled: boolean;
  };
}
