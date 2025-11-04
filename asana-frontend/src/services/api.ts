// API Service Layer with Retry Logic
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface ApiError {
  message: string;
  status?: number;
}

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  retryableStatuses?: number[];
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryableStatuses: [408, 429, 500, 502, 503, 504], // Timeout, rate limit, server errors
};

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    retryOptions: RetryOptions = {}
  ): Promise<T> {
    const config = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= config.maxRetries!; attempt++) {
      try {
        const result = await this.request<T>(endpoint, options);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Check if error is retryable
        const apiError = error as ApiError;
        const isRetryable = 
          attempt < config.maxRetries! &&
          (apiError.status === undefined || 
           config.retryableStatuses!.includes(apiError.status));

        if (!isRetryable) {
          throw error;
        }

        // Exponential backoff
        const delay = config.retryDelay! * Math.pow(2, attempt);
        console.warn(`API request failed (attempt ${attempt + 1}/${config.maxRetries! + 1}), retrying in ${delay}ms...`, error);
        await this.sleep(delay);
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - token expired
      if (response.status === 401) {
        // Try to refresh token
        const authService = await import('./authApi').then(m => m.authService);
        const newToken = await authService.refreshToken();
        
        if (!newToken) {
          // Token refresh failed, redirect to login
          authService.logout();
          window.location.href = '/login';
          throw new Error('Authentication required');
        }

        // Retry with new token
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });

        if (!retryResponse.ok) {
          const error = await retryResponse.json().catch(() => ({
            message: retryResponse.statusText || 'An error occurred',
          }));
          throw new Error(error.message || `HTTP ${retryResponse.status}`);
        }

        const contentType = retryResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return {} as T;
        }

        return await retryResponse.json();
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText || 'An error occurred',
        }));
        const apiError: ApiError = {
          message: error.message || `HTTP ${response.status}`,
          status: response.status,
        };
        throw apiError;
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async get<T>(endpoint: string, retryOptions?: RetryOptions): Promise<T> {
    return this.requestWithRetry<T>(endpoint, { method: 'GET' }, retryOptions);
  }

  async post<T>(endpoint: string, data?: any, retryOptions?: RetryOptions): Promise<T> {
    return this.requestWithRetry<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      retryOptions
    );
  }

  async put<T>(endpoint: string, data?: any, retryOptions?: RetryOptions): Promise<T> {
    return this.requestWithRetry<T>(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      retryOptions
    );
  }

  async patch<T>(endpoint: string, data?: any, retryOptions?: RetryOptions): Promise<T> {
    return this.requestWithRetry<T>(
      endpoint,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      retryOptions
    );
  }

  async delete<T>(endpoint: string, retryOptions?: RetryOptions): Promise<T> {
    return this.requestWithRetry<T>(endpoint, { method: 'DELETE' }, retryOptions);
  }
}

export const api = new ApiService();
