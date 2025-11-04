import { api } from './api';
import type { Task } from '../types/Task';
import type { TaskFilters } from '../components/FilterBar';

export interface CreateTaskData {
  name: string;
  description?: string;
  projectId?: string;
  sectionId?: string;
  dueDate?: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  completed?: boolean;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

const tasksApi = {
  // Get all tasks with optional filters and pagination
  async getAll(filters?: TaskFilters & PaginationOptions): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.projectId) params.append('project_id', filters.projectId);
      if (filters.assignee) params.append('assignee_id', filters.assignee);
      if (filters.completed !== null && filters.completed !== undefined) {
        params.append('completed', String(filters.completed));
      }
      if (filters.search) params.append('search', filters.search);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.dueDate?.start) params.append('due_date_start', filters.dueDate.start);
      if (filters.dueDate?.end) params.append('due_date_end', filters.dueDate.end);
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.offset) params.append('offset', String(filters.offset));
    }
    const query = params.toString();
    return api.get<Task[]>(`/tasks${query ? `?${query}` : ''}`);
  },

  // Get task by ID
  async getById(id: string): Promise<Task> {
    return api.get<Task>(`/tasks/${id}`);
  },

  // Create new task
  async create(data: CreateTaskData): Promise<Task> {
    return api.post<Task>('/tasks', {
      name: data.name,
      description: data.description,
      project_id: data.projectId,
      section_id: data.sectionId,
      due_date: data.dueDate,
      assignee_id: data.assignee,
      priority: data.priority || 'medium',
      tags: data.tags,
      completed: data.completed || false,
    });
  },

  // Update task
  async update(id: string, data: Partial<CreateTaskData>): Promise<Task> {
    return api.patch<Task>(`/tasks/${id}`, {
      name: data.name,
      description: data.description,
      project_id: data.projectId,
      section_id: data.sectionId,
      due_date: data.dueDate,
      assignee_id: data.assignee,
      priority: data.priority,
      tags: data.tags,
      completed: data.completed,
    });
  },

  // Delete task
  async delete(id: string): Promise<void> {
    return api.delete<void>(`/tasks/${id}`);
  },

  // Toggle task completion
  async toggleCompletion(id: string): Promise<Task> {
    // First get the task to check current state
    const task = await this.getById(id);
    return this.update(id, { completed: !task.completed });
  },
};

export default tasksApi;
