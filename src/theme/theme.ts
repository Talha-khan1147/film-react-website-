import { lightColors, darkColors, ColorPalette } from './colors';
import { typography } from './typography';
import { spacing, avatarSize, iconSize } from './spacing';
import { borderRadius } from './borderRadius';
import { shadows } from './shadows';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: ColorPalette;
  typography: typeof typography;
  spacing: typeof spacing;
  avatarSize: typeof avatarSize;
  iconSize: typeof iconSize;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
}

export const createTheme = (mode: ThemeMode): Theme => ({
  mode,
  colors: mode === 'dark' ? darkColors : lightColors,
  typography,
  spacing,
  avatarSize,
  iconSize,
  borderRadius,
  shadows,
});

export const defaultTheme = createTheme('dark');
