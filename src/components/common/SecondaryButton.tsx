import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface SecondaryButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
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
  const [isHovered, setIsHovered] = useState(false);

  const padding = size === 'sm' ? '7px 12px' : size === 'lg' ? '13px 22px' : '10px 16px';
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 16 : 14;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding,
        width: fullWidth ? '100%' : 'auto',
        borderRadius: theme.borderRadius.lg,
        backgroundColor: isHovered ? theme.colors.surfaceHover : theme.colors.surfaceElevated,
        color: theme.colors.text,
        border: `1px solid ${theme.colors.border}`,
        fontSize,
        fontWeight: theme.typography.fontWeight.medium,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transform: isPressed && !disabled ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.12s ease, background-color 0.15s ease',
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
