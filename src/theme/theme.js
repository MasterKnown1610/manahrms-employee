/**
 * Global theme structure for HRMS Employee app
 * Light and dark mode color sets
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const colorsLight = {
  primary: '#6B4E9E',
  primaryLight: '#E8E0F4',
  background: '#FFFFFF',
  backgroundInput: '#F8F6FC',
  surface: '#FFFFFF',
  text: '#2D2D2D',
  textSecondary: '#6B6B6B',
  placeholder: '#9E9E9E',
  border: '#E0D8EC',
  borderFocus: '#6B4E9E',
  error: '#C62828',
  success: '#2E7D32',
  priorityHigh: '#E57373',
  priorityMedium: '#FFB74D',
  cardBackground: '#F5F5F5',
};

export const colorsDark = {
  primary: '#B39DDB',
  primaryLight: '#4A3F6B',
  background: '#121212',
  backgroundInput: '#1E1E1E',
  surface: '#2D2D2D',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  placeholder: '#808080',
  border: '#404040',
  borderFocus: '#B39DDB',
  error: '#EF5350',
  success: '#66BB6A',
  priorityHigh: '#E57373',
  priorityMedium: '#FFB74D',
  cardBackground: '#2D2D2D',
};

export const getColors = (mode) => (mode === 'dark' ? colorsDark : colorsLight);

/** @deprecated Use useTheme() or getColors(mode) for light/dark support */
export const colors = colorsLight;

export const typography = {
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
  },
  placeholder: {},
  button: {
    fontSize: 16,
    fontWeight: '600',
  },
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  full: 9999,
};

export const inputHeight = 48;
export const iconSize = 22;

export default {
  colors: colorsLight,
  spacing,
  typography,
  borderRadius,
  inputHeight,
  iconSize,
};
