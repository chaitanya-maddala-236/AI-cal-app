import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { API_BASE_URL, TIMEOUT_MS } from '../constants';

let accessTokenGetter: (() => string | null) | null = null;
let onUnauthorized: (() => void) | null = null;

export function configureApiClient(
  tokenGetter: () => string | null,
  unauthorizedHandler: () => void,
): void {
  accessTokenGetter = tokenGetter;
  onUnauthorized = unauthorizedHandler;
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (accessTokenGetter) {
      const token = accessTokenGetter();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      onUnauthorized
    ) {
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      'Something went wrong'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong';
}

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await api.get<T>(url, config);
  return response.data;
}

export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await api.post<T>(url, data, config);
  return response.data;
}

export async function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await api.put<T>(url, data, config);
  return response.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await api.delete<T>(url, config);
  return response.data;
}

export default api;
