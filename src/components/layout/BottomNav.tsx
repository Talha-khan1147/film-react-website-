import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, Sparkles, Search, Bell, User } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';
import { useChats } from '../../hooks/useChats';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';

export const BottomNav: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const { totalUnreadCount } = useChats();
  const { unreadCount: notifUnreadCount } = useNotifications();

  // Hide bottom nav if inside chat conversation or auth screens
  if (
    location.pathname.startsWith('/chat/') ||
    location.pathname === ROUTES.LOGIN ||
    location.pathname === ROUTES.REGISTER
  ) {
    return null;
  }

  const tabs = [
    {
      id: 'chats',
      label: 'Chats',
      path: ROUTES.CHATS,
      icon: <MessageCircle size={22} />,
      badge: totalUnreadCount > 0 ? totalUnreadCount : undefined,
    },
    {
      id: 'stories',
      label: 'Stories',
      path: ROUTES.STORIES,
      icon: <Sparkles size={22} />,
    },
    {
      id: 'search',
      label: 'Search',
      path: ROUTES.SEARCH,
      icon: <Search size={22} />,
    },
    {
      id: 'notifications',
      label: 'Activity',
      path: ROUTES.NOTIFICATIONS,
      icon: <Bell size={22} />,
      badge: notifUnreadCount > 0 ? notifUnreadCount : undefined,
    },
    {
      id: 'profile',
      label: 'Profile',
      path: ROUTES.PROFILE,
      icon: <User size={22} />,
    },
  ];

  return (
    <nav
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.surface,
        borderTop: `1px solid ${theme.colors.borderLight}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 6px 12px 6px',
        boxSizing: 'border-box',
        zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}
    >
      {tabs.map((tab) => {
        const isActive =
          tab.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(tab.path);

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              padding: '4px 10px',
              position: 'relative',
              color: isActive ? theme.colors.primary : theme.colors.textMuted,
              transition: 'all 0.15s ease',
              flex: 1,
            }}
          >
            <div style={{ position: 'relative' }}>
              {tab.icon}

              {tab.badge !== undefined && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -8,
                    backgroundColor: theme.colors.accent,
                    color: '#FFFFFF',
                    fontSize: 10,
                    fontWeight: 700,
                    minWidth: 16,
                    height: 16,
                    borderRadius: theme.borderRadius.full,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    border: `2px solid ${theme.colors.surface}`,
                  }}
                >
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </div>

            <span
              style={{
                fontSize: 11,
                fontWeight: isActive ? 600 : 500,
                lineHeight: 1,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
