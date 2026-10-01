import { User } from './user';

export interface StorySlide {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'text-card';
  backgroundColor?: string;
  caption?: string;
  createdAt: string;
  durationMs: number; // default 5000ms
  isViewed: boolean;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  slides: StorySlide[];
  hasUnseen: boolean;
  updatedAt: string;
}
