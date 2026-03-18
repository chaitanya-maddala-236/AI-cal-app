import { API_ENDPOINTS } from '../constants';
import { AuthResponse, OnboardingData, UserProfile } from '../utils/types';
import { post, get, put } from './apiClient';

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return post<AuthResponse>(API_ENDPOINTS.LOGIN, { email, password });
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  return post<AuthResponse>(API_ENDPOINTS.REGISTER, { name, email, password });
}

export async function submitOnboarding(
  data: OnboardingData,
): Promise<UserProfile> {
  return post<UserProfile>(API_ENDPOINTS.USER_ONBOARDING, data);
}

export async function getUserProfile(): Promise<UserProfile> {
  return get<UserProfile>(API_ENDPOINTS.USER_PROFILE);
}

export async function updateUserProfile(
  data: Partial<UserProfile>,
): Promise<UserProfile> {
  return put<UserProfile>(API_ENDPOINTS.USER_UPDATE, data);
}
