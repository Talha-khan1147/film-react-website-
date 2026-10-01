import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface ReactionPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose?: () => void;
}

const COMMON_EMOJIS = ['❤️', '👍', '🔥', '😂', '😮', '🚀', '🎉', '👏'];

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  onSelectEmoji,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: theme.borderRadius.full,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.lg,
        animation: 'popIn 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        userSelect: 'none',
        zIndex: 50,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {COMMON_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelectEmoji(emoji)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 20,
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: theme.borderRadius.full,
            transition: 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};
