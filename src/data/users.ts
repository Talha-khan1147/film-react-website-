import { User, CurrentUserProfile } from '../types/user';

export const currentUser: CurrentUserProfile = {
  id: 'user_current',
  name: 'Alex Rivera',
  username: 'alexrivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  status: 'online',
  statusMessage: 'Crafting pixel-perfect experiences 🚀',
  bio: 'Design Engineer & Open Source enthusiast. Lover of minimalist interfaces, good espresso, and smooth micro-interactions.',
  phoneNumber: '+1 (555) 234-5678',
  email: 'alex.rivera@aurachat.app',
  isVerified: true,
  settings: {
    notificationsEnabled: true,
    readReceipts: true,
    onlineStatusVisible: true,
    soundEnabled: true,
  },
};

export const contacts: User[] = [
  {
    id: 'user_1',
    name: 'Elena Rostova',
    username: 'elena_design',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    status: 'online',
    statusMessage: 'Brainstorming the new UI system ✨',
    bio: 'Lead Product Designer @ Aura. Obsessed with typography, colors, and generative motion design.',
    lastSeen: '2026-09-19T10:05:00Z',
    isVerified: true,
  },
  {
    id: 'user_2',
    name: 'Marcus Chen',
    username: 'marcus_c',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    status: 'online',
    statusMessage: 'Coffee + Code ☕💻',
    bio: 'Distributed systems architect. Building scalable real-time sync engines.',
    lastSeen: '2026-09-19T09:58:00Z',
    isVerified: false,
  },
  {
    id: 'user_3',
    name: 'Sophia Williams',
    username: 'sophia_w',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    status: 'away',
    statusMessage: 'In a design review till 4 PM',
    bio: 'Brand strategist & photographer. Exploring light, shadow, and architectural minimalism.',
    lastSeen: '2026-09-19T08:30:00Z',
    isVerified: true,
  },
  {
    id: 'user_4',
    name: 'Liam Vance',
    username: 'liam_dev',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    status: 'offline',
    statusMessage: 'Traveling in Kyoto 🇯🇵',
    bio: 'Mobile Engineer. React Native, Swift, Kotlin enthusiast.',
    lastSeen: '2026-09-18T22:15:00Z',
    isVerified: false,
  },
  {
    id: 'user_5',
    name: 'Aria Tanaka',
    username: 'aria_art',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    status: 'online',
    statusMessage: 'Finishing 3D glass icons 🎨',
    bio: '3D Illustrator & visual artist. Creating playful digital dimensions.',
    lastSeen: '2026-09-19T10:10:00Z',
    isVerified: true,
  },
  {
    id: 'user_6',
    name: 'David Kim',
    username: 'david_k',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    status: 'offline',
    statusMessage: 'Off the grid this weekend',
    bio: 'Founder & Angel Investor. Supporting early-stage creative technology.',
    lastSeen: '2026-09-17T18:40:00Z',
    isVerified: false,
  },
  {
    id: 'user_7',
    name: 'Maya Patel',
    username: 'maya_ux',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    status: 'away',
    statusMessage: 'Conducting usability interviews 🎧',
    bio: 'UX Researcher. Translating user emotions into delightful digital products.',
    lastSeen: '2026-09-19T07:20:00Z',
    isVerified: false,
  },
];

export const allUsers: User[] = [currentUser, ...contacts];

export const getUserById = (id: string): User => {
  return allUsers.find((u) => u.id === id) || contacts[0];
};
