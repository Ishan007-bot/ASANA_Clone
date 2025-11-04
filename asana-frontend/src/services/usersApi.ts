// Users API Service
import { api } from './api';

export interface User {
  id: string;
  name: string | null;
  email: string;
  initials: string | null;
  avatarUrl: string | null;
}

export interface UpdateUserData {
  name?: string;
  avatarUrl?: string;
  theme?: string;
  notificationPreferences?: any;
}

const usersApi = {
  // Get all users (for mentions, assignments, etc.)
  async getAll(search?: string): Promise<User[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const query = params.toString();
    return api.get<User[]>(`/users${query ? `?${query}` : ''}`);
  },

  // Get user by ID
  async getById(id: string): Promise<User> {
    return api.get<User>(`/users/${id}`);
  },

  // Update user profile
  async update(id: string, data: UpdateUserData): Promise<User> {
    return api.put<User>(`/users/${id}`, data);
  },
};

export default usersApi;

