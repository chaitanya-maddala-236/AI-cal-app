import { API_ENDPOINTS } from '../constants';
import { AIScanResult, AIInsight, WeeklyAnalytics } from '../utils/types';
import { post, get } from './apiClient';

export async function scanFood(imageBase64: string): Promise<AIScanResult> {
  return post<AIScanResult>(API_ENDPOINTS.AI_SCAN, { image: imageBase64 });
}

export async function getAIInsights(): Promise<AIInsight> {
  return get<AIInsight>(API_ENDPOINTS.AI_INSIGHTS);
}

export async function getWeeklyAnalytics(): Promise<WeeklyAnalytics> {
  return get<WeeklyAnalytics>(API_ENDPOINTS.ANALYTICS_WEEKLY);
}
