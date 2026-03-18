import { GoalType, MealType } from '../constants';

// ─── User & Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface OnboardingData {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  goal: GoalType;
}

export interface UserProfile extends User, Partial<OnboardingData> {
  calorieTarget?: number;
  notificationsEnabled?: boolean;
  darkMode?: boolean;
}

// ─── Nutrition ────────────────────────────────────────────────────────────────

export interface Macros {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export interface FoodEntry extends Macros {
  id: string;
  name: string;
  calories: number;
  mealType: MealType;
  date: string;
  createdAt: string;
}

export interface ExerciseEntry {
  id: string;
  name: string;
  duration: number; // minutes
  caloriesBurned: number;
  date: string;
  createdAt: string;
}

export interface WaterEntry {
  id: string;
  amount: number; // ml
  date: string;
  createdAt: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardData {
  caloriesConsumed: number;
  calorieTarget: number;
  macros: Macros;
  streak: number;
  waterConsumed: number;
  waterTarget: number;
  recentActivity: Array<FoodEntry | ExerciseEntry>;
}

// ─── AI ──────────────────────────────────────────────────────────────────────

export interface AIScanResult {
  dish: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

export interface AIInsight {
  insight: string;
  suggestion: string;
  goal: GoalType;
  trends: string[];
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface WeeklyDataPoint {
  date: string;
  calories: number;
  water: number;
  protein: number;
  carbs: number;
  fat: number;
  weight?: number;
}

export interface WeeklyAnalytics {
  data: WeeklyDataPoint[];
  averageCalories: number;
  averageWater: number;
  weightChange: number;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Onboarding: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  AnalysisTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  DailyDetail: { date: string };
  EditEntry: { entry: FoodEntry | ExerciseEntry; type: 'food' | 'exercise' };
  AIInsights: undefined;
  AddMeal: { mealType?: MealType };
  AddExercise: undefined;
  AddWater: undefined;
  AIScanner: undefined;
};

export type AnalysisStackParamList = {
  Analysis: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};
