export const Colors = {
  // Primary
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  primaryLight: '#A5D6A7',

  // Secondary
  secondary: '#FF9800',
  secondaryLight: '#FFE0B2',

  // Accent
  accent: '#2196F3',

  // Background
  background: '#F8F9FA',
  backgroundDark: '#121212',
  surface: '#FFFFFF',
  surfaceDark: '#1E1E1E',
  card: '#FFFFFF',
  cardDark: '#2C2C2C',

  // Text
  text: '#212121',
  textDark: '#FFFFFF',
  textSecondary: '#757575',
  textSecondaryDark: '#B0B0B0',

  // Status
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',

  // Macros
  protein: '#E91E63',
  carbs: '#FF9800',
  fat: '#9C27B0',
  water: '#2196F3',
  calories: '#4CAF50',

  // UI
  border: '#E0E0E0',
  borderDark: '#424242',
  placeholder: '#BDBDBD',
  disabled: '#E0E0E0',
  shadow: 'rgba(0,0,0,0.1)',
  overlay: 'rgba(0,0,0,0.5)',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type ColorKey = keyof typeof Colors;
