/**
 * Global theme structure for HRMS Employee app
 * Purple accent, light backgrounds, consistent spacing
 */
export const colors = {
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

export const typography = {
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: colors.text,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
  },
  placeholder: {
    color: colors.placeholder,
  },
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
  colors,
  spacing,
  typography,
  borderRadius,
  inputHeight,
  iconSize,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
