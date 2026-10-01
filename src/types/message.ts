export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file';

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs who reacted
  hasReacted?: boolean;
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'file' | 'audio';
  url: string;
  name?: string;
  size?: string;
  duration?: number; // for audio/video in seconds
  thumbnailUrl?: string;
}

export interface ReplyPreviewInfo {
  messageId: string;
  senderName: string;
  text: string;
  attachmentType?: 'image' | 'file' | 'audio';
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  type: MessageType;
  status: MessageStatus;
  timestamp: string;
  dateKey: string; // e.g. "2026-09-19" for grouping date separators
  reactions: Reaction[];
  replyTo?: ReplyPreviewInfo;
  attachments?: Attachment[];
  isEdited?: boolean;
  isDeleted?: boolean;
}
