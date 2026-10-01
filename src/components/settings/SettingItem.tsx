import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  rightValue?: string;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onClick,
  isToggle = false,
  toggleValue = false,
  onToggleChange,
  rightValue,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isToggle && onToggleChange) {
      onToggleChange(!toggleValue);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: isHovered ? theme.colors.surfaceHover : theme.colors.surface,
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.surfaceElevated,
            color: theme.colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 14.5,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 12,
                color: theme.colors.textMuted,
                marginTop: 2,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {rightValue && (
          <span style={{ fontSize: 13, color: theme.colors.textMuted }}>{rightValue}</span>
        )}

        {isToggle ? (
          <div
            style={{
              width: 44,
              height: 24,
              borderRadius: theme.borderRadius.full,
              backgroundColor: toggleValue ? theme.colors.primary : theme.colors.border,
              position: 'relative',
              transition: 'background-color 0.2s ease',
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: theme.borderRadius.full,
                backgroundColor: '#FFFFFF',
                position: 'absolute',
                top: 3,
                left: toggleValue ? 23 : 3,
                transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: theme.shadows.sm,
              }}
            />
          </div>
        ) : (
          <ChevronRight size={18} color={theme.colors.textMuted} />
        )}
      </div>
    </div>
  );
};
