import { User } from './user';
import { Message } from './message';

export type ChatType = 'direct' | 'group';

export type ChatFilter = 'all' | 'unread' | 'groups' | 'pinned';

export interface ChatParticipant {
  user: User;
  role?: 'admin' | 'member';
}

export interface Chat {
  id: string;
  type: ChatType;
  name: string;
  avatar?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isTyping?: boolean;
  typingUserName?: string;
  updatedAt: string;
  draftText?: string;
}
