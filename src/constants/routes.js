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
  REGISTER: '/register',
};

export const getChatRoute = (chatId) => `/chat/${chatId}`;
