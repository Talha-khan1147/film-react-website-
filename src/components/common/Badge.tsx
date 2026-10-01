import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface BadgeProps {
  count?: number;
  label?: string;
  variant?: 'primary' | 'accent' | 'muted' | 'success' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  label,
  variant = 'primary',
  size = 'md',
}) => {
  const { theme } = useTheme();

  const getStyles = () => {
    switch (variant) {
      case 'accent':
        return {
          backgroundColor: theme.colors.accent,
          color: '#FFFFFF',
          border: 'none',
        };
      case 'success':
        return {
          backgroundColor: theme.colors.success,
          color: '#FFFFFF',
          border: 'none',
        };
      case 'muted':
        return {
          backgroundColor: theme.colors.surfaceHover,
          color: theme.colors.textSecondary,
          border: `1px solid ${theme.colors.border}`,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.primary,
          border: `1px solid ${theme.colors.primary}`,
        };
      case 'primary':
      default:
        return {
          backgroundColor: theme.colors.primary,
          color: '#FFFFFF',
          border: 'none',
        };
    }
  };

  const styleConfig = getStyles();
  const isPill = count !== undefined;
  const displayText = count !== undefined ? (count > 99 ? '99+' : count.toString()) : label;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isPill ? (size === 'sm' ? '1px 5px' : '2px 7px') : '3px 8px',
        minWidth: isPill ? (size === 'sm' ? 16 : 20) : 'auto',
        height: size === 'sm' ? 16 : 20,
        borderRadius: theme.borderRadius.full,
        fontSize: size === 'sm' ? 10 : 11,
        fontWeight: theme.typography.fontWeight.semibold,
        lineHeight: 1,
        boxSizing: 'border-box',
        ...styleConfig,
      }}
    >
      {displayText}
    </span>
  );
};
