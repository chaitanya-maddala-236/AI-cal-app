import { create } from 'zustand';
import { FoodEntry, ExerciseEntry, WaterEntry, DashboardData } from '../utils/types';
import { MealType } from '../constants/api';

interface DailyLog {
  date: string;
  food: FoodEntry[];
  exercises: ExerciseEntry[];
  water: WaterEntry[];
}

interface DashboardState {
  dashboard: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  selectedDate: string;
  dailyLogs: Record<string, DailyLog>;

  setDashboard: (data: DashboardData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedDate: (date: string) => void;
  setDailyLog: (date: string, log: Partial<DailyLog>) => void;
  addFoodEntry: (entry: FoodEntry) => void;
  removeFoodEntry: (id: string, date: string) => void;
  updateFoodEntry: (id: string, date: string, entry: Partial<FoodEntry>) => void;
  addExerciseEntry: (entry: ExerciseEntry) => void;
  addWaterEntry: (entry: WaterEntry) => void;
  getFoodByMealType: (date: string, mealType: MealType) => FoodEntry[];
  getTotalWaterForDate: (date: string) => number;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dashboard: null,
  isLoading: false,
  error: null,
  selectedDate: new Date().toISOString().split('T')[0],
  dailyLogs: {},

  setDashboard: (dashboard: DashboardData) => set({ dashboard }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  setSelectedDate: (selectedDate: string) => set({ selectedDate }),

  setDailyLog: (date: string, log: Partial<DailyLog>) =>
    set((state) => {
      const existing = state.dailyLogs[date];
      return {
        dailyLogs: {
          ...state.dailyLogs,
          [date]: {
            date,
            food: existing?.food ?? [],
            exercises: existing?.exercises ?? [],
            water: existing?.water ?? [],
            ...log,
          },
        },
      };
    }),

  addFoodEntry: (entry: FoodEntry) => {
    const date = entry.date;
    set((state) => {
      const existing = state.dailyLogs[date] || {
        date,
        food: [],
        exercises: [],
        water: [],
      };
      return {
        dailyLogs: {
          ...state.dailyLogs,
          [date]: { ...existing, food: [...existing.food, entry] },
        },
      };
    });
  },

  removeFoodEntry: (id: string, date: string) => {
    set((state) => {
      const log = state.dailyLogs[date];
      if (!log) {
        return state;
      }
      return {
        dailyLogs: {
          ...state.dailyLogs,
          [date]: { ...log, food: log.food.filter((e) => e.id !== id) },
        },
      };
    });
  },

  updateFoodEntry: (id: string, date: string, updates: Partial<FoodEntry>) => {
    set((state) => {
      const log = state.dailyLogs[date];
      if (!log) {
        return state;
      }
      return {
        dailyLogs: {
          ...state.dailyLogs,
          [date]: {
            ...log,
            food: log.food.map((e) =>
              e.id === id ? { ...e, ...updates } : e,
            ),
          },
        },
      };
    });
  },

  addExerciseEntry: (entry: ExerciseEntry) => {
    const date = entry.date;
    set((state) => {
      const existing = state.dailyLogs[date] || {
        date,
        food: [],
        exercises: [],
        water: [],
      };
      return {
        dailyLogs: {
          ...state.dailyLogs,
          [date]: {
            ...existing,
            exercises: [...existing.exercises, entry],
          },
        },
      };
    });
  },

  addWaterEntry: (entry: WaterEntry) => {
    const date = entry.date;
    set((state) => {
      const existing = state.dailyLogs[date] || {
        date,
        food: [],
        exercises: [],
        water: [],
      };
      return {
        dailyLogs: {
          ...state.dailyLogs,
          [date]: { ...existing, water: [...existing.water, entry] },
        },
      };
    });
  },

  getFoodByMealType: (date: string, mealType: MealType): FoodEntry[] => {
    const log = get().dailyLogs[date];
    if (!log) {
      return [];
    }
    return log.food.filter((e) => e.mealType === mealType);
  },

  getTotalWaterForDate: (date: string): number => {
    const log = get().dailyLogs[date];
    if (!log) {
      return 0;
    }
    return log.water.reduce((sum, e) => sum + e.amount, 0);
  },
}));
