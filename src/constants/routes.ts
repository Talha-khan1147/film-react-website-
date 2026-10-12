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
  SETUP_PROFILE: '/setup-profile',
};

export const getChatRoute = (chatId: string) => `/chat/${chatId}`;
