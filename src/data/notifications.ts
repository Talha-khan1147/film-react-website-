import { AppNotification } from '../types/notification';
import { contacts } from './users';

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'message',
    actor: contacts[0],
    title: 'Elena Rostova',
    body: 'sent you a message: "Are you ready for the design handoff call today?"',
    timestamp: '2026-09-19T10:04:00Z',
    isRead: false,
    targetChatId: 'chat_1',
  },
  {
    id: 'notif_2',
    type: 'reaction',
    actor: contacts[1],
    title: 'Marcus Chen',
    body: 'reacted 🚀 to your message: "Sub-18ms! That makes message delivery feel instantaneous..."',
    timestamp: '2026-09-19T08:21:00Z',
    isRead: false,
    targetChatId: 'chat_2',
  },
  {
    id: 'notif_3',
    type: 'story',
    actor: contacts[4],
    title: 'Aria Tanaka',
    body: 'shared a new story: "New 3D glass rendering tests in Blender 💎"',
    timestamp: '2026-09-19T07:15:00Z',
    isRead: true,
    targetStoryId: 'story_4',
  },
  {
    id: 'notif_4',
    type: 'system',
    actor: contacts[0],
    title: 'Aura Security',
    body: 'End-to-end encryption keys verified for all direct and group conversations.',
    timestamp: '2026-09-18T18:00:00Z',
    isRead: true,
  },
];
