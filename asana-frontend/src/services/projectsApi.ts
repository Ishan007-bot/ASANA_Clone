// Projects API Service
import { api } from './api';

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  viewType?: 'list' | 'board' | 'timeline';
  teamId?: string;
  workspaceId?: string;
  sections?: Section[];
  createdAt?: string;
  updatedAt?: string;
  team?: {
    id: string;
    name: string;
  };
  workspace?: {
    id: string;
    name: string;
  };
  members?: Array<{
    id: string;
    userId: string;
    projectId: string;
    role: string;
    user?: {
      id: string;
      name: string;
      email: string;
      initials?: string;
    };
  }>;
  _count?: {
    tasks: number;
  };
}

export interface Section {
  id: string;
  name: string;
  position: number;
  tasks?: any[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  view_type?: 'list' | 'board' | 'timeline';
  team_id?: string;
  workspace_id?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

const projectsApi = {
  // Get all projects
  async getAll(filters?: {
    team_id?: string;
    workspace_id?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Project[]> {
    const params = new URLSearchParams();
    if (filters?.team_id) params.append('team_id', filters.team_id);
    if (filters?.workspace_id) params.append('workspace_id', filters.workspace_id);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));

    const query = params.toString();
    return api.get<Project[]>(`/projects${query ? `?${query}` : ''}`);
  },

  // Get project by ID with sections and tasks
  async getById(id: string): Promise<Project> {
    return api.get<Project>(`/projects/${id}`);
  },

  // Create project
  async create(data: CreateProjectData): Promise<Project> {
    return api.post<Project>('/projects', data);
  },

  // Update project
  async update(id: string, data: UpdateProjectData): Promise<Project> {
    return api.put<Project>(`/projects/${id}`, data);
  },

  // Delete project
  async delete(id: string): Promise<void> {
    return api.delete<void>(`/projects/${id}`);
  },
};

export default projectsApi;

