import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';
import { User, OnboardingData, UserProfile } from '../utils/types';
import { GoalType } from '../constants';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  accessToken: string | null;
  error: string | null;

  setAuth: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  loadFromStorage: () => Promise<void>;
}

interface OnboardingState {
  isCompleted: boolean;
  data: Partial<OnboardingData>;
  currentStep: number;

  setOnboardingData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

interface UserProfileState {
  profile: UserProfile | null;
  goal: GoalType | null;
  darkMode: boolean;
  notificationsEnabled: boolean;
  streak: number;

  setProfile: (profile: UserProfile) => void;
  setGoal: (goal: GoalType) => void;
  toggleDarkMode: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setStreak: (streak: number) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const KEYCHAIN_SERVICE = 'ai_calories_tracker';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  accessToken: null,
  error: null,

  setAuth: async (token: string, user: User) => {
    await Keychain.setGenericPassword(
      user.email,
      JSON.stringify({ token, user }),
      { service: KEYCHAIN_SERVICE },
    );
    set({ isAuthenticated: true, accessToken: token, user, error: null });
  },

  logout: async () => {
    await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
    set({ isAuthenticated: false, accessToken: null, user: null });
  },

  setUser: (user: User) => set({ user }),
  setError: (error: string | null) => set({ error }),
  setLoading: (isLoading: boolean) => set({ isLoading }),

  loadFromStorage: async () => {
    set({ isLoading: true });
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
      });
      if (credentials) {
        const parsed = JSON.parse(credentials.password) as {
          token: string;
          user: User;
        };
        set({
          isAuthenticated: true,
          accessToken: parsed.token,
          user: parsed.user,
        });
      }
    } catch {
      // ignore errors loading from storage
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const useOnboardingStore = create<OnboardingState>((set) => ({
  isCompleted: false,
  data: {},
  currentStep: 0,

  setOnboardingData: (data: Partial<OnboardingData>) =>
    set((state) => ({ data: { ...state.data, ...data } })),

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

  completeOnboarding: () => set({ isCompleted: true }),
  resetOnboarding: () => set({ isCompleted: false, data: {}, currentStep: 0 }),
}));

export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: null,
  goal: null,
  darkMode: false,
  notificationsEnabled: true,
  streak: 0,

  setProfile: (profile: UserProfile) =>
    set({ profile, goal: (profile.goal as GoalType) ?? null }),

  setGoal: (goal: GoalType) => set({ goal }),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  setNotificationsEnabled: (notificationsEnabled: boolean) =>
    set({ notificationsEnabled }),

  setStreak: (streak: number) => set({ streak }),

  updateProfile: (data: Partial<UserProfile>) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...data } : null,
    })),
}));
