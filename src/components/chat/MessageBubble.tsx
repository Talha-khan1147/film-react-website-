import React, { useState } from 'react';
import { Smile, Reply, FileText, Music, Play } from 'lucide-react';
import { Message, ReplyPreviewInfo } from '../../types/message';
import { User } from '../../types/user';
import { useTheme } from '../../theme/ThemeProvider';
import { formatMessageTime } from '../../utils/dateUtils';
import { MessageStatus } from './MessageStatus';
import { ReplyPreview } from './ReplyPreview';
import { ReactionPicker } from './ReactionPicker';

interface MessageBubbleProps {
  message: Message;
  sender: User;
  isOutgoing: boolean;
  onReply: (info: ReplyPreviewInfo) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  sender,
  isOutgoing,
  onReply,
  onToggleReaction,
}) => {
  const { theme } = useTheme();
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleReply = () => {
    onReply({
      messageId: message.id,
      senderName: isOutgoing ? 'You' : sender.name,
      text: message.text,
      attachmentType: message.attachments && message.attachments[0]?.type,
    });
  };

  const handleReactionSelect = (emoji: string) => {
    onToggleReaction(message.id, emoji);
    setShowReactionPicker(false);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowReactionPicker(false);
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOutgoing ? 'flex-end' : 'flex-start',
        margin: '3px 0',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Action triggers (Reply, Reaction) floating over bubble on hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: -14,
            [isOutgoing ? 'right' : 'left']: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            backgroundColor: theme.colors.surfaceElevated,
            borderRadius: theme.borderRadius.full,
            border: `1px solid ${theme.colors.border}`,
            padding: '2px 6px',
            boxShadow: theme.shadows.sm,
            zIndex: 20,
          }}
        >
          <button
            type="button"
            onClick={() => setShowReactionPicker((prev) => !prev)}
            aria-label="Add reaction"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              padding: 3,
              color: theme.colors.textMuted,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Smile size={14} />
          </button>
          <button
            type="button"
            onClick={handleReply}
            aria-label="Reply to message"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              padding: 3,
              color: theme.colors.textMuted,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Reply size={14} />
          </button>
        </div>
      )}

      {/* Floating Reaction Picker */}
      {showReactionPicker && (
        <div
          style={{
            position: 'absolute',
            top: -42,
            [isOutgoing ? 'right' : 'left']: 10,
            zIndex: 30,
          }}
        >
          <ReactionPicker onSelectEmoji={handleReactionSelect} />
        </div>
      )}

      {/* Bubble Container */}
      <div
        style={{
          maxWidth: '82%',
          padding: '9px 13px',
          borderRadius: isOutgoing
            ? theme.borderRadius.bubbleOutgoing
            : theme.borderRadius.bubbleIncoming,
          background: isOutgoing
            ? theme.colors.bubbleOutgoingGradient
            : theme.colors.bubbleIncoming,
          color: isOutgoing
            ? theme.colors.bubbleOutgoingText
            : theme.colors.bubbleIncomingText,
          border: isOutgoing ? 'none' : `1px solid ${theme.colors.border}`,
          boxShadow: isOutgoing ? theme.shadows.sm : '0 1px 2px rgba(0,0,0,0.04)',
          position: 'relative',
          wordBreak: 'break-word',
          boxSizing: 'border-box',
        }}
      >
        {/* Reply Quote preview */}
        {message.replyTo && (
          <ReplyPreview replyTo={message.replyTo} isInsideBubble />
        )}

        {/* Media Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div style={{ marginBottom: message.text ? 8 : 0 }}>
            {message.attachments.map((att) => {
              if (att.type === 'image') {
                return (
                  <div
                    key={att.id}
                    style={{
                      borderRadius: theme.borderRadius.md,
                      overflow: 'hidden',
                      maxHeight: 260,
                      marginBottom: 4,
                    }}
                  >
                    <img
                      src={att.url}
                      alt={att.name || 'Image'}
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                );
              } else if (att.type === 'video') {
                return (
                  <div
                    key={att.id}
                    style={{
                      borderRadius: theme.borderRadius.md,
                      overflow: 'hidden',
                      maxHeight: 280,
                      marginBottom: 4,
                      backgroundColor: '#000000',
                    }}
                  >
                    <video
                      src={att.url}
                      controls
                      playsInline
                      style={{
                        width: '100%',
                        maxHeight: 280,
                        display: 'block',
                      }}
                    />
                  </div>
                );
              } else if (att.type === 'file') {
                return (
                  <div
                    key={att.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 10px',
                      backgroundColor: 'rgba(0,0,0,0.08)',
                      borderRadius: theme.borderRadius.md,
                      marginBottom: 4,
                    }}
                  >
                    <FileText size={22} color={isOutgoing ? '#FFFFFF' : theme.colors.primary} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {att.name}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.75 }}>{att.size}</div>
                    </div>
                  </div>
                );
              } else if (att.type === 'audio') {
                return (
                  <div
                    key={att.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 12px',
                      backgroundColor: 'rgba(0,0,0,0.08)',
                      borderRadius: theme.borderRadius.full,
                      marginBottom: 4,
                      minWidth: 160,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: isOutgoing ? '#FFFFFF' : theme.colors.primary,
                        color: isOutgoing ? theme.colors.primary : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Play size={13} fill="currentColor" style={{ marginLeft: 2 }} />
                    </div>
                    {/* Audio wave bars */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
                      {[12, 18, 10, 22, 16, 8, 20, 14, 24, 12, 16].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            width: 3,
                            height: h,
                            backgroundColor: isOutgoing ? 'rgba(255,255,255,0.7)' : theme.colors.primary,
                            borderRadius: 2,
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, opacity: 0.85 }}>0:42</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Message Text */}
        {message.text && (
          <div
            style={{
              fontSize: 14.5,
              lineHeight: 1.45,
              whiteSpace: 'pre-wrap',
            }}
          >
            {message.text}
          </div>
        )}

        {/* Timestamp and Status Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 4,
            marginTop: 4,
            fontSize: 10.5,
            color: isOutgoing ? 'rgba(255, 255, 255, 0.75)' : theme.colors.textMuted,
            lineHeight: 1,
          }}
        >
          <span>{formatMessageTime(message.timestamp)}</span>
          {isOutgoing && <MessageStatus status={message.status} size={13} />}
        </div>
      </div>

      {/* Reactions Bar beneath bubble */}
      {message.reactions && message.reactions.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            marginTop: -6,
            zIndex: 10,
            padding: '0 4px',
          }}
        >
          {message.reactions.map((reaction) => (
            <button
              key={reaction.emoji}
              type="button"
              onClick={() => onToggleReaction(message.id, reaction.emoji)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                padding: '2px 6px',
                borderRadius: theme.borderRadius.full,
                backgroundColor: reaction.hasReacted
                  ? theme.colors.primaryLight
                  : theme.colors.surfaceElevated,
                border: `1px solid ${
                  reaction.hasReacted ? theme.colors.primary : theme.colors.border
                }`,
                fontSize: 11,
                fontWeight: theme.typography.fontWeight.medium,
                color: reaction.hasReacted ? theme.colors.primary : theme.colors.text,
                cursor: 'pointer',
                boxShadow: theme.shadows.sm,
              }}
            >
              <span>{reaction.emoji}</span>
              <span>{reaction.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
