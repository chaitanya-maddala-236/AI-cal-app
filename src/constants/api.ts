export const API_BASE_URL = 'https://api.aicaloriestracker.com/v1';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',

  // User
  USER_PROFILE: '/user/profile',
  USER_UPDATE: '/user/update',
  USER_ONBOARDING: '/user/onboarding',

  // Dashboard
  DASHBOARD_TODAY: '/dashboard/today',

  // Logs
  LOGS: '/logs',
  LOGS_FOOD: '/logs/food',
  LOGS_EXERCISE: '/logs/exercise',
  LOGS_WATER: '/logs/water',

  // AI
  AI_SCAN: '/ai/scan',
  AI_INSIGHTS: '/ai/insights',

  // Analytics
  ANALYTICS_WEEKLY: '/analytics/weekly',
} as const;

export const TIMEOUT_MS = 30000;
export const QUICK_WATER_AMOUNTS = [250, 500, 750, 1000];
export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const GOALS = {
  FAT_LOSS: 'fat_loss',
  MUSCLE_GAIN: 'muscle_gain',
  MAINTENANCE: 'maintenance',
} as const;
export type GoalType = (typeof GOALS)[keyof typeof GOALS];
