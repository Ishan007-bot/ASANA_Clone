// Task type definition - exported separately for better module resolution
export interface Task {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  assignee?: string;
  projectId?: string;
  sectionId?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  subtasks?: Task[];
  position?: number; // Position within section/board
}



