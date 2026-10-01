import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface StoryRingProps {
  hasUnseen: boolean;
  size?: number;
  children: React.ReactNode;
  onClick?: () => void;
}

export const StoryRing: React.FC<StoryRingProps> = ({
  hasUnseen,
  size = 56,
  children,
  onClick,
}) => {
  const { theme } = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: theme.borderRadius.full,
        padding: 2.5,
        boxSizing: 'border-box',
        background: hasUnseen
          ? theme.colors.accentGradient
          : theme.colors.border,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.15s ease',
        boxShadow: hasUnseen ? theme.shadows.glowStory : 'none',
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: theme.borderRadius.full,
          border: `2px solid ${theme.colors.surface}`,
          overflow: 'hidden',
          boxSizing: 'border-box',
          backgroundColor: theme.colors.surface,
        }}
      >
        {children}
      </div>
    </div>
  );
};
