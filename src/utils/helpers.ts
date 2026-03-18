import { Macros } from './types';

export function formatCalories(calories: number): string {
  return Math.round(calories).toLocaleString();
}

export function formatMacro(value: number, unit = 'g'): string {
  return `${Math.round(value)}${unit}`;
}

export function calculateRemainingCalories(
  target: number,
  consumed: number,
): number {
  return Math.max(0, target - consumed);
}

export function calculateProgress(consumed: number, target: number): number {
  if (target <= 0) {
    return 0;
  }
  return Math.min(1, consumed / target);
}

export function calculateTotalCalories(macros: Macros): number {
  return macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function isToday(dateString: string): boolean {
  return dateString === getTodayDateString();
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
