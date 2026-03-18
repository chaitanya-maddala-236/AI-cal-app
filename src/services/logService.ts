import { API_ENDPOINTS } from '../constants';
import {
  DashboardData,
  FoodEntry,
  ExerciseEntry,
  WaterEntry,
} from '../utils/types';
import { MealType } from '../constants/api';
import { get, post, put, del } from './apiClient';

// Dashboard
export async function getDashboardToday(): Promise<DashboardData> {
  return get<DashboardData>(API_ENDPOINTS.DASHBOARD_TODAY);
}

// Food Logs
export async function getLogsByDate(
  date: string,
): Promise<{ food: FoodEntry[]; exercises: ExerciseEntry[]; water: WaterEntry[] }> {
  return get(API_ENDPOINTS.LOGS, { params: { date } });
}

export async function addFoodEntry(data: {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: MealType;
  date: string;
}): Promise<FoodEntry> {
  return post<FoodEntry>(API_ENDPOINTS.LOGS_FOOD, data);
}

export async function updateFoodEntry(
  id: string,
  data: Partial<FoodEntry>,
): Promise<FoodEntry> {
  return put<FoodEntry>(`${API_ENDPOINTS.LOGS}/${id}`, data);
}

export async function deleteFoodEntry(id: string): Promise<void> {
  return del<void>(`${API_ENDPOINTS.LOGS}/${id}`);
}

// Exercise
export async function addExerciseEntry(data: {
  name: string;
  duration: number;
  caloriesBurned: number;
  date: string;
}): Promise<ExerciseEntry> {
  return post<ExerciseEntry>(API_ENDPOINTS.LOGS_EXERCISE, data);
}

// Water
export async function addWaterEntry(data: {
  amount: number;
  date: string;
}): Promise<WaterEntry> {
  return post<WaterEntry>(API_ENDPOINTS.LOGS_WATER, data);
}
