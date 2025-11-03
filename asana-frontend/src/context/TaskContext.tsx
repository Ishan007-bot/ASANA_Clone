import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../types/Task';

// Re-export Task for convenience
export type { Task };

interface TaskContextType {
  tasks: Task[];
  loading?: boolean;
  error?: string | null;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task | Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Task | null | Promise<Task | null>;
  deleteTask: (id: string) => boolean | Promise<boolean>;
  toggleTaskCompletion: (id: string) => void | Promise<void>;
  getTasksByProject: (projectId: string) => Task[];
  getTaskById: (id: string) => Task | undefined;
  refreshTasks?: () => Promise<void>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    // Mock data for demonstration
    {
      id: '1',
      name: 'Review design mockups',
      description: 'Review the latest design mockups for the new feature',
      completed: false,
      dueDate: '2025-02-15',
      assignee: 'IG',
      projectId: '1',
      priority: 'high',
      tags: ['design', 'review'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Update documentation',
      description: 'Update project documentation with latest changes',
      completed: false,
      dueDate: '2025-02-20',
      assignee: 'w3',
      projectId: '1',
      priority: 'medium',
      tags: ['documentation'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Plan sprint meeting',
      completed: true,
      dueDate: '2025-02-10',
      assignee: 'wd',
      projectId: '1',
      priority: 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const createTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: taskData.completed ?? false,
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>): Task | null => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === id);
      if (taskIndex === -1) return prev;
      
      const updated = [...prev];
      updated[taskIndex] = {
        ...updated[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });
    
    const updatedTask = tasks.find((t) => t.id === id);
    return updatedTask ? { ...updatedTask, ...updates } : null;
  }, [tasks]);

  const deleteTask = useCallback((id: string): boolean => {
    setTasks((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      return filtered.length !== prev.length ? filtered : prev;
    });
    return true;
  }, []);

  const toggleTaskCompletion = useCallback((id: string) => {
    updateTask(id, { completed: !tasks.find((t) => t.id === id)?.completed });
  }, [tasks, updateTask]);

  const getTasksByProject = useCallback((projectId: string): Task[] => {
    return tasks.filter((t) => t.projectId === projectId);
  }, [tasks]);

  const getTaskById = useCallback((id: string): Task | undefined => {
    return tasks.find((t) => t.id === id);
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading: false,
        error: null,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        getTasksByProject,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

// Keep old export for backward compatibility, but prefer unified hook

