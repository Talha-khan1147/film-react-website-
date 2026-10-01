import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, MessageSquare, Heart, Sparkles, Shield, Trash2 } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { useNotifications } from '../hooks/useNotifications';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { Avatar } from '../components/common/Avatar';
import { EmptyState } from '../components/common/EmptyState';
import { getRelativeTime } from '../utils/dateUtils';
import { getChatRoute } from '../constants/routes';
import { NotificationType, AppNotification } from '../types/notification';

export const NotificationsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const { notifications, markAsRead, markAllAsRead, clearNotification, unreadCount } =
    useNotifications();

  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={13} color="#6366F1" />;
      case 'reaction':
        return <Heart size={13} color="#EC4899" />;
      case 'story':
        return <Sparkles size={13} color="#F59E0B" />;
      case 'system':
      default:
        return <Shield size={13} color="#10B981" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.targetChatId) {
      navigate(getChatRoute(notif.targetChatId));
    } else if (notif.targetStoryId) {
      navigate('/stories');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <AppHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        rightActions={
          unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllAsRead}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'transparent',
                border: 'none',
                color: theme.colors.primary,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <CheckCheck size={16} />
              <span>Mark all read</span>
            </button>
          ) : undefined
        }
      />

      <ScreenContainer scrollable noPadding>
        {/* Filter chips */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px 8px 16px',
            overflowX: 'auto',
          }}
        >
          {['all', 'message', 'reaction', 'story'].map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: '6px 14px',
                  borderRadius: theme.borderRadius.full,
                  border: 'none',
                  backgroundColor: isActive
                    ? theme.colors.primary
                    : theme.colors.surfaceElevated,
                  color: isActive ? '#FFFFFF' : theme.colors.textSecondary,
                  fontSize: 12.5,
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  outline: 'none',
                }}
              >
                {filter === 'all' ? 'All Activity' : `${filter}s`}
              </button>
            );
          })}
        </div>

        {/* Notifications list */}
        <div style={{ padding: '8px 12px 80px 12px' }}>
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: theme.borderRadius.xl,
                  backgroundColor: notif.isRead
                    ? 'transparent'
                    : `${theme.colors.primary}12`,
                  border: `1px solid ${
                    notif.isRead ? theme.colors.borderLight : `${theme.colors.primary}30`
                  }`,
                  marginBottom: 8,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar src={notif.actor.avatar} name={notif.actor.name} size="md" />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      backgroundColor: theme.colors.surface,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: theme.shadows.sm,
                    }}
                  >
                    {getIconForType(notif.type)}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: notif.isRead ? 500 : 600,
                      color: theme.colors.text,
                      lineHeight: 1.35,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{notif.actor.name} </span>
                    {notif.body}
                  </div>

                  <div
                    style={{
                      fontSize: 11.5,
                      color: theme.colors.textMuted,
                      marginTop: 4,
                    }}
                  >
                    {getRelativeTime(notif.timestamp)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotification(notif.id);
                  }}
                  aria-label="Remove notification"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 4,
                    cursor: 'pointer',
                    color: theme.colors.textMuted,
                    display: 'flex',
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          ) : (
            <EmptyState
              icon={<Bell size={32} />}
              title="No notifications"
              description="When you receive new messages, reactions, or stories, they will appear here."
            />
          )}
        </div>
      </ScreenContainer>
    </div>
  );
};
