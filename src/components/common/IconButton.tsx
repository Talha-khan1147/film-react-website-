import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  ariaLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'filled' | 'primary' | 'accent';
  disabled?: boolean;
  badgeCount?: number;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  title,
  ariaLabel,
  size = 'md',
  variant = 'ghost',
  disabled = false,
  badgeCount,
}) => {
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dimension = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          color: '#FFFFFF',
          border: 'none',
        };
      case 'accent':
        return {
          backgroundColor: theme.colors.accent,
          color: '#FFFFFF',
          border: 'none',
        };
      case 'filled':
        return {
          backgroundColor: isHovered ? theme.colors.surfaceHover : theme.colors.surfaceElevated,
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`,
        };
      case 'ghost':
      default:
        return {
          backgroundColor: isHovered ? theme.colors.surfaceHover : 'transparent',
          color: isHovered ? theme.colors.text : theme.colors.textSecondary,
          border: 'none',
        };
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title || ariaLabel}
      aria-label={ariaLabel || title}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        position: 'relative',
        width: dimension,
        height: dimension,
        borderRadius: theme.borderRadius.full,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transform: isPressed && !disabled ? 'scale(0.92)' : 'scale(1)',
        transition: 'transform 0.12s ease, background-color 0.15s ease, color 0.15s ease',
        outline: 'none',
        padding: 0,
        flexShrink: 0,
        ...getVariantStyles(),
      }}
    >
      {icon}

      {badgeCount !== undefined && badgeCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            backgroundColor: theme.colors.accent,
            color: '#FFFFFF',
            fontSize: 9,
            fontWeight: theme.typography.fontWeight.bold,
            minWidth: 15,
            height: 15,
            borderRadius: theme.borderRadius.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 3px',
            border: `1.5px solid ${theme.colors.surface}`,
          }}
        >
          {badgeCount > 9 ? '9+' : badgeCount}
        </span>
      )}
    </button>
  );
};
