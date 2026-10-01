import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { formatDateSeparator } from '../../utils/dateUtils';

interface DateSeparatorProps {
  dateKey: string;
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({ dateKey }) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '16px 0 12px 0',
      }}
    >
      <div
        style={{
          padding: '4px 12px',
          borderRadius: theme.borderRadius.full,
          backgroundColor: theme.colors.surfaceElevated,
          border: `1px solid ${theme.colors.borderLight}`,
          fontSize: 11,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.textSecondary,
          letterSpacing: theme.typography.letterSpacing.wide,
          boxShadow: theme.shadows.sm,
          userSelect: 'none',
        }}
      >
        {formatDateSeparator(dateKey)}
      </div>
    </div>
  );
};
