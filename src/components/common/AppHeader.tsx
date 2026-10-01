import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';
import { IconButton } from './IconButton';

interface AppHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  leftAction?: React.ReactNode;
  rightActions?: React.ReactNode;
  avatar?: React.ReactNode;
  className?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  showBack = false,
  leftAction,
  rightActions,
  avatar,
}) => {
  const { theme } = useTheme();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: theme.colors.surface,
        borderBottom: `1px solid ${theme.colors.borderLight}`,
        position: 'sticky',
        top: 0,
        zIndex: 40,
        minHeight: 58,
        boxSizing: 'border-box',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flex: 1,
          minWidth: 0,
        }}
      >
        {showBack && onBack && (
          <IconButton
            icon={<ArrowLeft size={20} />}
            onClick={onBack}
            ariaLabel="Go back"
            size="sm"
          />
        )}

        {leftAction}

        {avatar}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.2,
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
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {rightActions && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
            marginLeft: 8,
          }}
        >
          {rightActions}
        </div>
      )}
    </header>
  );
};
