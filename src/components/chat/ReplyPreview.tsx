import React from 'react';
import { X, Reply } from 'lucide-react';
import { ReplyPreviewInfo } from '../../types/message';
import { useTheme } from '../../theme/ThemeProvider';
import { truncateText } from '../../utils/formatters';

interface ReplyPreviewProps {
  replyTo: ReplyPreviewInfo;
  onCancel?: () => void;
  isInsideBubble?: boolean;
}

export const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  replyTo,
  onCancel,
  isInsideBubble = false,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 10px',
        backgroundColor: isInsideBubble
          ? 'rgba(0, 0, 0, 0.12)'
          : theme.colors.surfaceElevated,
        borderLeft: `3px solid ${theme.colors.primary}`,
        borderRadius: theme.borderRadius.sm,
        marginBottom: isInsideBubble ? 6 : 0,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
        <Reply size={14} color={theme.colors.primary} style={{ flexShrink: 0 }} />

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.primary,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {replyTo.senderName}
          </div>

          <div
            style={{
              fontSize: 12,
              color: isInsideBubble ? 'inherit' : theme.colors.textSecondary,
              opacity: isInsideBubble ? 0.85 : 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {replyTo.attachmentType === 'image' && '📷 Photo: '}
            {truncateText(replyTo.text || 'Attachment', 50)}
          </div>
        </div>
      </div>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel reply"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            padding: 4,
            color: theme.colors.textMuted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
