import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        padding: '16px 16px 8px 16px',
        fontSize: 12,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.primary,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        userSelect: 'none',
      }}
    >
      {title}
    </div>
  );
};
