import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface ScreenContainerProps {
  children: React.ReactNode;
  noPadding?: boolean;
  scrollable?: boolean;
  style?: React.CSSProperties;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  noPadding = false,
  scrollable = true,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        overflowY: scrollable ? 'auto' : 'hidden',
        overflowX: 'hidden',
        padding: noPadding ? 0 : '16px',
        boxSizing: 'border-box',
        WebkitOverflowScrolling: 'touch',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
