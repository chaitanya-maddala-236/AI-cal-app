// Navigation Screen Names
export const SCREENS = {
  // Auth
  SIGN_IN: 'SignIn',
  SIGN_UP: 'SignUp',

  // Onboarding
  ONBOARDING: 'Onboarding',

  // Main Tabs
  HOME_TAB: 'HomeTab',
  ANALYSIS_TAB: 'AnalysisTab',
  PROFILE_TAB: 'ProfileTab',

  // Home Stack
  HOME: 'Home',
  DAILY_DETAIL: 'DailyDetail',
  EDIT_ENTRY: 'EditEntry',
  AI_INSIGHTS: 'AIInsights',

  // Meal/Food
  ADD_MEAL: 'AddMeal',
  ADD_EXERCISE: 'AddExercise',
  ADD_WATER: 'AddWater',
  AI_SCANNER: 'AIScanner',

  // Analysis
  ANALYSIS: 'Analysis',

  // Profile
  PROFILE: 'Profile',
} as const;

export type ScreenName = (typeof SCREENS)[keyof typeof SCREENS];
