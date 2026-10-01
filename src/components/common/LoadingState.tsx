import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface LoadingStateProps {
  message?: string;
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  rows = 4,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            opacity: 1 - i * 0.15,
          }}
        >
          {/* Skeleton Avatar */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: theme.borderRadius.full,
              backgroundColor: theme.colors.surfaceElevated,
              flexShrink: 0,
              animation: 'pulse 1.5s infinite ease-in-out',
            }}
          />

          {/* Skeleton Lines */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                width: `${60 - i * 5}%`,
                height: 14,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: theme.colors.surfaceElevated,
                animation: 'pulse 1.5s infinite ease-in-out',
              }}
            />
            <div
              style={{
                width: `${85 - i * 8}%`,
                height: 12,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: theme.colors.surfaceHover,
                animation: 'pulse 1.5s infinite ease-in-out',
              }}
            />
          </div>
        </div>
      ))}

      {message && (
        <div
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: theme.colors.textMuted,
            marginTop: 12,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};
