// Sections API Service
import { api } from './api';

export interface Section {
  id: string;
  projectId: string;
  name: string;
  position: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSectionData {
  project_id: string;
  name: string;
  position?: number;
}

export interface UpdateSectionData {
  name?: string;
  position?: number;
}

const sectionsApi = {
  // Get sections for a project (included in project data)
  // Separate endpoint if needed in future
  async getByProject(projectId: string): Promise<Section[]> {
    // Sections are typically included when fetching project
    // This is a placeholder for future expansion
    return [];
  },

  // Create section
  async create(data: CreateSectionData): Promise<Section> {
    return api.post<Section>('/sections', data);
  },

  // Update section
  async update(id: string, data: UpdateSectionData): Promise<Section> {
    return api.put<Section>(`/sections/${id}`, data);
  },

  // Delete section
  async delete(id: string): Promise<void> {
    return api.delete<void>(`/sections/${id}`);
  },
};

export default sectionsApi;

