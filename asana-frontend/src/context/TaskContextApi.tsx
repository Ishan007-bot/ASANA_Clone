import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../types/Task';
import tasksApi, { type CreateTaskData } from '../services/tasksApi';
import { wsService } from '../services/websocket';

// Re-export Task for convenience
export type { Task };

// Toast helper - safe to use even if ToastProvider not available
type ToastHandler = ((message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => void) | null;

let toastHandler: ToastHandler = null;

export function setToastHandler(handler: ToastHandler) {
  toastHandler = handler;
}

function showToastSafe(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 5000) {
  if (toastHandler) {
    toastHandler(message, type, duration);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  getTasksByProject: (projectId: string) => Task[];
  getTaskById: (id: string) => Task | undefined;
  refreshTasks: () => Promise<void>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProviderApi({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousTasksRef = useRef<Task[]>([]);

  // Load tasks on mount
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await tasksApi.getAll();
      setTasks(fetchedTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(errorMessage);
      
      // If backend is not available, show a warning but don't block the UI
      if (errorMessage.includes('fetch') || errorMessage.includes('Network') || errorMessage.includes('Connection')) {
        console.warn('Backend not available, using empty task list. Set VITE_USE_API=false to use local mock data.');
        setTasks([]); // Start with empty list
        showToastSafe('Backend server not available. Set VITE_USE_API=false in .env to use local mode.', 'warning');
      } else {
        showToastSafe(errorMessage, 'error');
      }
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();

    // Connect WebSocket
    wsService.connect().catch((err) => {
      console.warn('WebSocket connection failed:', err);
      // Continue without real-time updates if WebSocket fails
    });

    // Subscribe to WebSocket events
    const unsubscribeTaskUpdate = wsService.subscribe('task_updated', (data: { task: Task }) => {
      setTasks((prev) => {
        const index = prev.findIndex((t) => t.id === data.task.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = data.task;
          return updated;
        }
        return prev;
      });
    });

    const unsubscribeTaskCreated = wsService.subscribe('task_created', (data: { task: Task }) => {
      setTasks((prev) => [...prev, data.task]);
      showToastSafe(`Task "${data.task.name}" created`, 'success');
    });

    const unsubscribeTaskDeleted = wsService.subscribe('task_deleted', (data: { taskId: string }) => {
      setTasks((prev) => prev.filter((t) => t.id !== data.taskId));
    });

    return () => {
      unsubscribeTaskUpdate();
      unsubscribeTaskCreated();
      unsubscribeTaskDeleted();
      wsService.disconnect();
    };
  }, [loadTasks]);

  const createTask = useCallback(
    async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
      try {
        // Optimistic update
        const optimisticTask: Task = {
          ...taskData,
          id: `temp_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completed: taskData.completed ?? false,
        };
        setTasks((prev) => [...prev, optimisticTask]);

        const newTask = await tasksApi.create(taskData as CreateTaskData);

        // Replace optimistic task with real one
        setTasks((prev) => prev.map((t) => (t.id === optimisticTask.id ? newTask : t)));

        showToastSafe(`Task "${newTask.name}" created`, 'success');
        return newTask;
      } catch (err) {
        // Rollback optimistic update
        setTasks((prev) => prev.filter((t) => !t.id.startsWith('temp_')));
        const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
        showToastSafe(errorMessage, 'error');
        throw err;
      }
    },
    []
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>): Promise<Task | null> => {
      // Save current state for rollback
      previousTasksRef.current = [...tasks];
      
      try {
        // Optimistic update
        setTasks((prev) => {
          const index = prev.findIndex((t) => t.id === id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...updates, updatedAt: new Date().toISOString() };
            return updated;
          }
          return prev;
        });

        const updatedTask = await tasksApi.update(id, updates as CreateTaskData);

        // Replace with server response
        setTasks((prev) => {
          const index = prev.findIndex((t) => t.id === id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = updatedTask;
            return updated;
          }
          return prev;
        });

        return updatedTask;
      } catch (err) {
        // Rollback
        const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
        setTasks(previousTasksRef.current);
        showToastSafe(errorMessage, 'error');
        return null;
      }
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const task = tasks.find((t) => t.id === id);
        
        // Optimistic update
        setTasks((prev) => prev.filter((t) => t.id !== id));

        await tasksApi.delete(id);
        showToastSafe(`Task "${task?.name || 'Task'}" deleted`, 'success');
        return true;
      } catch (err) {
        // Rollback - reload tasks
        await loadTasks();
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
        showToastSafe(errorMessage, 'error');
        return false;
      }
    },
    [tasks, loadTasks]
  );

  const toggleTaskCompletion = useCallback(
    async (id: string): Promise<void> => {
      try {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        // Optimistic update
        setTasks((prev) => {
          const index = prev.findIndex((t) => t.id === id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = { ...updated[index], completed: !updated[index].completed };
            return updated;
          }
          return prev;
        });

        await tasksApi.toggleCompletion(id);
      } catch (err) {
        // Rollback - reload tasks
        await loadTasks();
        const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
        showToastSafe(errorMessage, 'error');
      }
    },
    [tasks, loadTasks]
  );

  const getTasksByProject = useCallback(
    (projectId: string): Task[] => {
      return tasks.filter((t) => t.projectId === projectId);
    },
    [tasks]
  );

  const getTaskById = useCallback(
    (id: string): Task | undefined => {
      return tasks.find((t) => t.id === id);
    },
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        getTasksByProject,
        getTaskById,
        refreshTasks: loadTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasksApi() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasksApi must be used within a TaskProviderApi');
  }
  return context;
}

// Export as useTasks too for compatibility
export { useTasksApi as useTasks };
