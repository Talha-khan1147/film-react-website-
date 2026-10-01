import React, { useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Mic, X } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';
import { IconButton } from '../common/IconButton';
import { ReplyPreview } from './ReplyPreview';
import { ReplyPreviewInfo, Attachment } from '../../types/message';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  replyTo?: ReplyPreviewInfo;
  onCancelReply?: () => void;
  attachments?: Attachment[];
  onRemoveAttachment?: (id: string) => void;
  onOpenAttachments: () => void;
  onToggleEmojiPicker: () => void;
  isEmojiPickerOpen?: boolean;
  onSelectEmoji?: (emoji: string) => void;
}

const QUICK_EMOJIS = ['😊', '😂', '🔥', '❤️', '👍', '🎉', '✨', '🙌', '💯', '🤔'];

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  replyTo,
  onCancelReply,
  attachments = [],
  onRemoveAttachment,
  onOpenAttachments,
  onToggleEmojiPicker,
  isEmojiPickerOpen,
  onSelectEmoji,
}) => {
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on scrollHeight
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim().length > 0 || attachments.length > 0) {
        onSend();
      }
    }
  };

  const hasContent = value.trim().length > 0 || attachments.length > 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colors.surface,
        borderTop: `1px solid ${theme.colors.borderLight}`,
        padding: '10px 14px',
        position: 'sticky',
        bottom: 0,
        zIndex: 30,
        boxSizing: 'border-box',
      }}
    >
      {/* Active Reply Banner */}
      {replyTo && onCancelReply && (
        <div style={{ marginBottom: 8 }}>
          <ReplyPreview replyTo={replyTo} onCancel={onCancelReply} />
        </div>
      )}

      {/* Attachment Chips Preview */}
      {attachments.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            overflowX: 'auto',
            marginBottom: 8,
            paddingBottom: 2,
          }}
        >
          {attachments.map((att) => (
            <div
              key={att.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 8px',
                backgroundColor: theme.colors.surfaceElevated,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                fontSize: 12,
                color: theme.colors.text,
                flexShrink: 0,
              }}
            >
              {att.type === 'image' && (
                <img
                  src={att.url}
                  alt={att.name}
                  style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover' }}
                />
              )}
              <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {att.name || 'Attachment'}
              </span>
              {onRemoveAttachment && (
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(att.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: theme.colors.textMuted,
                    display: 'flex',
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Emoji Picker Tray */}
      {isEmojiPickerOpen && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            overflowX: 'auto',
            padding: '6px 0',
            marginBottom: 6,
            borderBottom: `1px solid ${theme.colors.borderLight}`,
          }}
        >
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onSelectEmoji && onSelectEmoji(emoji)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 22,
                cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: theme.borderRadius.md,
                flexShrink: 0,
                transition: 'transform 0.1s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Main Composer Row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <IconButton
          icon={<Smile size={20} color={isEmojiPickerOpen ? theme.colors.primary : theme.colors.textSecondary} />}
          onClick={onToggleEmojiPicker}
          ariaLabel="Emojis"
          size="sm"
        />

        <IconButton
          icon={<Paperclip size={19} />}
          onClick={onOpenAttachments}
          ariaLabel="Add attachment"
          size="sm"
        />

        <div
          style={{
            flex: 1,
            backgroundColor: theme.colors.surfaceElevated,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.border}`,
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            minHeight: 40,
            boxSizing: 'border-box',
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: theme.colors.text,
              fontSize: 14,
              fontFamily: theme.typography.fontFamily.sans,
              lineHeight: 1.4,
              resize: 'none',
              maxHeight: 120,
              overflowY: 'auto',
            }}
          />
        </div>

        {hasContent ? (
          <button
            type="button"
            onClick={onSend}
            aria-label="Send message"
            style={{
              width: 38,
              height: 38,
              borderRadius: theme.borderRadius.full,
              background: theme.colors.primaryGradient,
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: theme.shadows.md,
              transition: 'transform 0.12s ease',
              flexShrink: 0,
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Send size={16} />
          </button>
        ) : (
          <IconButton
            icon={<Mic size={20} />}
            onClick={() => {
              // Voice note simulation: fills text with demo note
              onChange('🎙️ [Voice message: 0:15]');
            }}
            ariaLabel="Record voice message"
            size="sm"
          />
        )}
      </div>
    </div>
  );
};
