// Authentication API Service
import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    initials: string | null;
    avatarUrl: string | null;
    theme: string;
  };
  token: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    this.setAuthData(response);
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    this.setAuthData(response);
    return response;
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    return api.get<AuthResponse['user']>('/auth/me');
  }

  setAuthData(authResponse: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    // Disconnect WebSocket
    if (window.wsService) {
      window.wsService.disconnect();
    }
  }

  // Refresh token if needed (for future implementation)
  async refreshToken(): Promise<string | null> {
    try {
      const user = await this.getCurrentUser();
      // If getCurrentUser succeeds, token is still valid
      return this.getToken();
    } catch (error) {
      // Token expired or invalid, logout
      this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();

