export const ROUTES = {
  HOME: '/',
  CHATS: '/',
  CHAT_DETAILS: '/chat/:id',
  STORIES: '/stories',
  SEARCH: '/search',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  LOGIN: '/login',
};

export const getChatRoute = (chatId: string) => `/chat/${chatId}`;
