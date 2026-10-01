import { User } from './user';

export type NotificationType = 'message' | 'reaction' | 'story' | 'mention' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  actor: User;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  targetChatId?: string;
  targetStoryId?: string;
}
