import { Story } from '../types/story';
import { contacts, currentUser } from './users';

export const initialStories: Story[] = [
  {
    id: 'story_current',
    userId: currentUser.id,
    user: currentUser,
    hasUnseen: false,
    updatedAt: '2026-09-19T08:00:00Z',
    slides: [
      {
        id: 's_curr_1',
        mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
        mediaType: 'image',
        caption: 'Morning design session in the loft workspace ☀️☕',
        createdAt: '2026-09-19T08:00:00Z',
        durationMs: 5000,
        isViewed: true,
      },
    ],
  },
  {
    id: 'story_1',
    userId: contacts[0].id,
    user: contacts[0],
    hasUnseen: true,
    updatedAt: '2026-09-19T09:15:00Z',
    slides: [
      {
        id: 's_1_1',
        mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
        mediaType: 'image',
        caption: 'Color harmony experiments for Aura 2.0 ✨',
        createdAt: '2026-09-19T08:45:00Z',
        durationMs: 5000,
        isViewed: false,
      },
      {
        id: 's_1_2',
        mediaUrl: '',
        mediaType: 'text-card',
        backgroundColor: '#4F46E5',
        caption: '“Simplicity is about subtracting the obvious and adding the meaningful.” — John Maeda',
        createdAt: '2026-09-19T09:15:00Z',
        durationMs: 5000,
        isViewed: false,
      },
    ],
  },
  {
    id: 'story_2',
    userId: contacts[1].id,
    user: contacts[1],
    hasUnseen: true,
    updatedAt: '2026-09-19T09:30:00Z',
    slides: [
      {
        id: 's_2_1',
        mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        mediaType: 'image',
        caption: 'Debugging sub-millisecond network packets ⚡💻',
        createdAt: '2026-09-19T09:30:00Z',
        durationMs: 5000,
        isViewed: false,
      },
    ],
  },
  {
    id: 'story_3',
    userId: contacts[2].id,
    user: contacts[2],
    hasUnseen: false,
    updatedAt: '2026-09-18T20:00:00Z',
    slides: [
      {
        id: 's_3_1',
        mediaUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
        mediaType: 'image',
        caption: 'Sunset over the bay. Golden hour never disappoints.',
        createdAt: '2026-09-18T20:00:00Z',
        durationMs: 5000,
        isViewed: true,
      },
    ],
  },
  {
    id: 'story_4',
    userId: contacts[4].id,
    user: contacts[4],
    hasUnseen: true,
    updatedAt: '2026-09-19T07:15:00Z',
    slides: [
      {
        id: 's_4_1',
        mediaUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
        mediaType: 'image',
        caption: 'New 3D glass rendering tests in Blender 💎',
        createdAt: '2026-09-19T07:15:00Z',
        durationMs: 5000,
        isViewed: false,
      },
    ],
  },
];
