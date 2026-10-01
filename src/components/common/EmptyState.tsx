import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        margin: 'auto 0',
      }}
    >
      {icon && (
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.surfaceElevated,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.primary,
            marginBottom: 20,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {icon}
        </div>
      )}

      <h3
        style={{
          fontSize: 18,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text,
          margin: '0 0 8px 0',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: 14,
          color: theme.colors.textMuted,
          maxWidth: 320,
          margin: '0 0 24px 0',
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      {actionLabel && onAction && (
        <PrimaryButton label={actionLabel} onClick={onAction} size="sm" />
      )}
    </div>
  );
};
