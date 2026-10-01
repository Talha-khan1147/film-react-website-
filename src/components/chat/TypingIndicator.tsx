import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface TypingIndicatorProps {
  userName?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ userName }) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        maxWidth: 180,
        backgroundColor: theme.colors.bubbleIncoming,
        borderRadius: theme.borderRadius.bubbleIncoming,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.sm,
        margin: '4px 0 8px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {[0, 1, 2].map((idx) => (
          <span
            key={idx}
            style={{
              width: 7,
              height: 7,
              borderRadius: theme.borderRadius.full,
              backgroundColor: theme.colors.primary,
              animation: `bounceDot 1.2s infinite ease-in-out both`,
              animationDelay: `${idx * 0.18}s`,
            }}
          />
        ))}
      </div>

      {userName && (
        <span
          style={{
            fontSize: 12,
            color: theme.colors.textMuted,
            fontWeight: theme.typography.fontWeight.medium,
          }}
        >
          {userName} is typing...
        </span>
      )}
    </div>
  );
};
