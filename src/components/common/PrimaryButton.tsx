import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onClick,
  icon,
  disabled = false,
  fullWidth = false,
  size = 'md',
  type = 'button',
}) => {
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  const padding = size === 'sm' ? '8px 14px' : size === 'lg' ? '14px 24px' : '11px 18px';
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 16 : 14;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding,
        width: fullWidth ? '100%' : 'auto',
        borderRadius: theme.borderRadius.lg,
        background: theme.colors.primaryGradient,
        color: '#FFFFFF',
        border: 'none',
        fontSize,
        fontWeight: theme.typography.fontWeight.semibold,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transform: isPressed && !disabled ? 'scale(0.97)' : 'scale(1)',
        boxShadow: disabled ? 'none' : theme.shadows.md,
        transition: 'transform 0.12s ease, opacity 0.15s ease, box-shadow 0.15s ease',
        outline: 'none',
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
