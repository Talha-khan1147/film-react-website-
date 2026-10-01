import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface DividerProps {
  spacingVertical?: number;
  color?: string;
  inset?: number;
}

export const Divider: React.FC<DividerProps> = ({
  spacingVertical = 0,
  color,
  inset = 0,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        height: 1,
        backgroundColor: color || theme.colors.borderLight,
        marginTop: spacingVertical,
        marginBottom: spacingVertical,
        marginLeft: inset,
        width: inset > 0 ? `calc(100% - ${inset}px)` : '100%',
      }}
    />
  );
};
