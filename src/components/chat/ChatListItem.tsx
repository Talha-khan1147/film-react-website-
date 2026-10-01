import React, { useState } from 'react';
import { Pin, VolumeX, MoreVertical, Trash2 } from 'lucide-react';
import { Chat } from '../../types/chat';
import { useTheme } from '../../theme/ThemeProvider';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { formatChatListTime } from '../../utils/dateUtils';
import { truncateText } from '../../utils/formatters';
import { MessageStatus } from './MessageStatus';
import { useAuth } from '../../hooks/useAuth';

interface ChatListItemProps {
  chat: Chat;
  isActive?: boolean;
  onClick: () => void;
  onTogglePin?: (id: string) => void;
  onToggleMute?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  isActive = false,
  onClick,
  onTogglePin,
  onToggleMute,
  onDelete,
}) => {
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // For direct chats, get counterpart (the other person relative to current user)
  const counterpart = chat.participants?.find((p) => p.id !== currentUser?.id) || chat.participants?.[0];
  const displayName = chat.type === 'direct' && counterpart ? counterpart.name : chat.name;
  const displayAvatar = chat.type === 'direct' && counterpart ? counterpart.avatar : (chat.avatar || counterpart?.avatar);
  const lastMsg = chat.lastMessage;
  const isOutgoingLast = lastMsg?.senderId === currentUser?.id;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: isActive
          ? theme.colors.surfaceHover
          : isHovered
          ? `${theme.colors.surfaceElevated}90`
          : 'transparent',
        borderRadius: theme.borderRadius.xl,
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        userSelect: 'none',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '2px 0',
      }}
    >
      {/* Avatar with Status */}
      <div style={{ marginRight: 14, flexShrink: 0 }}>
        <Avatar
          src={displayAvatar}
          name={displayName}
          size="lg"
          status={counterpart?.status}
          showStatus={chat.type === 'direct'}
        />
      </div>

      {/* Main Info */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Name & Time Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight:
                chat.unreadCount > 0
                  ? theme.typography.fontWeight.bold
                  : theme.typography.fontWeight.semibold,
              color: theme.colors.text,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginRight: 8,
            }}
          >
            {displayName}
          </div>

          <div
            style={{
              fontSize: 11.5,
              color: chat.unreadCount > 0 ? theme.colors.primary : theme.colors.textMuted,
              fontWeight:
                chat.unreadCount > 0
                  ? theme.typography.fontWeight.semibold
                  : theme.typography.fontWeight.regular,
              flexShrink: 0,
            }}
          >
            {lastMsg ? formatChatListTime(lastMsg.timestamp) : ''}
          </div>
        </div>

        {/* Message Snippet & Badges Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              minWidth: 0,
              flex: 1,
              marginRight: 8,
              fontSize: 13,
              color: chat.unreadCount > 0 ? theme.colors.text : theme.colors.textMuted,
            }}
          >
            {chat.isTyping ? (
              <span
                style={{
                  color: theme.colors.primary,
                  fontWeight: theme.typography.fontWeight.medium,
                  fontStyle: 'italic',
                }}
              >
                typing...
              </span>
            ) : (
              <>
                {isOutgoingLast && lastMsg && (
                  <MessageStatus status={lastMsg.status} size={13} />
                )}
                <span
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {lastMsg
                    ? truncateText(
                        lastMsg.attachments?.length ? '📷 Photo' : lastMsg.text,
                        40
                      )
                    : 'No messages yet'}
                </span>
              </>
            )}
          </div>

          {/* Indicators: Muted, Pinned, Unread Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {chat.isMuted && <VolumeX size={14} color={theme.colors.textMuted} />}
            {chat.isPinned && <Pin size={13} color={theme.colors.primary} />}
            {chat.unreadCount > 0 && (
              <Badge count={chat.unreadCount} variant="primary" size="sm" />
            )}
          </div>
        </div>
      </div>

      {/* Hover action menu button */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.full,
            boxShadow: theme.shadows.md,
            padding: 2,
            border: `1px solid ${theme.colors.border}`,
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label="Chat options"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: theme.colors.textMuted,
              display: 'flex',
            }}
          >
            <MoreVertical size={14} />
          </button>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: 28,
                right: 0,
                backgroundColor: theme.colors.surfaceElevated,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.lg,
                boxShadow: theme.shadows.lg,
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 120,
                zIndex: 40,
              }}
            >
              {onTogglePin && (
                <button
                  type="button"
                  onClick={() => {
                    onTogglePin(chat.id);
                    setShowMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    color: theme.colors.text,
                    fontSize: 12,
                    cursor: 'pointer',
                    borderRadius: theme.borderRadius.sm,
                    textAlign: 'left',
                  }}
                >
                  <Pin size={13} />
                  <span>{chat.isPinned ? 'Unpin' : 'Pin to top'}</span>
                </button>
              )}

              {onToggleMute && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleMute(chat.id);
                    setShowMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    color: theme.colors.text,
                    fontSize: 12,
                    cursor: 'pointer',
                    borderRadius: theme.borderRadius.sm,
                    textAlign: 'left',
                  }}
                >
                  <VolumeX size={13} />
                  <span>{chat.isMuted ? 'Unmute' : 'Mute'}</span>
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(chat.id);
                    setShowMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    color: theme.colors.error,
                    fontSize: 12,
                    cursor: 'pointer',
                    borderRadius: theme.borderRadius.sm,
                    textAlign: 'left',
                  }}
                >
                  <Trash2 size={13} />
                  <span>Delete Chat</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
