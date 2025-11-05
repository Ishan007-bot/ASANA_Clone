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
  joinProjectRoom: (projectId: string) => void;
  leaveProjectRoom: (projectId: string) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProviderApi({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousTasksRef = useRef<Task[]>([]);
  const currentProjectIdRef = useRef<string | null>(null);

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

    // Subscribe to WebSocket events (fixed event names - using colons as backend emits)
    const unsubscribeTaskUpdate = wsService.subscribe('task:updated', (data: { task: Task }) => {
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

    const unsubscribeTaskCreated = wsService.subscribe('task:created', (data: { task: Task; tempId?: string }) => {
      setTasks((prev) => {
        // If tempId provided, replace temp task with real one
        if (data.tempId) {
          const tempIndex = prev.findIndex((t) => t.id === data.tempId);
          if (tempIndex >= 0) {
            const updated = [...prev];
            updated[tempIndex] = data.task;
            return updated;
          }
        }
        // Otherwise, check if task already exists (avoid duplicates)
        const exists = prev.some((t) => t.id === data.task.id);
        if (!exists) {
          return [...prev, data.task];
        }
        return prev;
      });
      if (!data.tempId) {
        showToastSafe(`Task "${data.task.name}" created`, 'success');
      }
    });

    const unsubscribeTaskDeleted = wsService.subscribe('task:deleted', (data: { taskId: string }) => {
      setTasks((prev) => prev.filter((t) => t.id !== data.taskId));
    });

    const unsubscribeTaskMoved = wsService.subscribe('task:moved', (data: { taskId: string; newSectionId: string | null; newPosition: number }) => {
      setTasks((prev) => {
        const index = prev.findIndex((t) => t.id === data.taskId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            sectionId: data.newSectionId || undefined,
            position: data.newPosition,
          };
          return updated;
        }
        return prev;
      });
    });

    return () => {
      unsubscribeTaskUpdate();
      unsubscribeTaskCreated();
      unsubscribeTaskDeleted();
      unsubscribeTaskMoved();
      // Don't disconnect WebSocket here as it might be used by other components
    };
  }, [loadTasks]);

  const joinProjectRoom = useCallback((projectId: string) => {
    if (currentProjectIdRef.current && currentProjectIdRef.current !== projectId) {
      // Leave previous project room
      wsService.leaveProject(currentProjectIdRef.current);
    }
    currentProjectIdRef.current = projectId;
    wsService.joinProject(projectId);
  }, []);

  const leaveProjectRoom = useCallback((projectId: string) => {
    wsService.leaveProject(projectId);
    if (currentProjectIdRef.current === projectId) {
      currentProjectIdRef.current = null;
    }
  }, []);

  const createTask = useCallback(
    async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
      try {
        // Optimistic update
        const tempId = `temp_${Date.now()}`;
        const optimisticTask: Task = {
          ...taskData,
          id: tempId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completed: taskData.completed ?? false,
        };
        setTasks((prev) => [...prev, optimisticTask]);

        // Try WebSocket first, fallback to REST API
        if (wsService.isConnected() && taskData.projectId) {
          // Send via WebSocket for real-time updates
          wsService.createTaskViaSocket(tempId, {
            name: taskData.name,
            description: taskData.description,
            project_id: taskData.projectId,
            section_id: taskData.sectionId,
            due_date: taskData.dueDate,
            assignee_id: taskData.assignee,
            priority: taskData.priority || 'medium',
            tags: taskData.tags || [],
            completed: taskData.completed || false,
          });
          // WebSocket will handle the response and update the task
          return optimisticTask;
        } else {
          // Fallback to REST API
          const newTask = await tasksApi.create(taskData as CreateTaskData);
          // Replace optimistic task with real one
          setTasks((prev) => prev.map((t) => (t.id === tempId ? newTask : t)));
          showToastSafe(`Task "${newTask.name}" created`, 'success');
          return newTask;
        }
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

        // Try WebSocket first, fallback to REST API
        if (wsService.isConnected()) {
          wsService.updateTaskViaSocket(id, {
            name: updates.name,
            description: updates.description,
            project_id: updates.projectId,
            section_id: updates.sectionId,
            due_date: updates.dueDate,
            assignee_id: updates.assignee,
            priority: updates.priority,
            tags: updates.tags,
            completed: updates.completed,
          });
          // WebSocket will handle the response
          return tasks.find((t) => t.id === id) || null;
        } else {
          // Fallback to REST API
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
        }
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

        // Try WebSocket first, fallback to REST API
        if (wsService.isConnected()) {
          wsService.deleteTaskViaSocket(id);
          // WebSocket will handle the response
        } else {
          await tasksApi.delete(id);
        }
        
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

        // Save current state for rollback
        previousTasksRef.current = [...tasks];

        // Optimistic update
        setTasks((prev) => {
          const index = prev.findIndex((t) => t.id === id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = { ...updated[index], completed: !updated[index].completed, updatedAt: new Date().toISOString() };
            return updated;
          }
          return prev;
        });

        // Try WebSocket first, fallback to REST API
        if (wsService.isConnected()) {
          wsService.updateTaskViaSocket(id, {
            completed: !task.completed,
          });
          // WebSocket will handle the response via the task:updated event
        } else {
          // Fallback to REST API
          const updatedTask = await tasksApi.toggleCompletion(id);
          // Replace with server response to ensure consistency
          setTasks((prev) => {
            const index = prev.findIndex((t) => t.id === id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = updatedTask;
              return updated;
            }
            return prev;
          });
        }
      } catch (err) {
        // Rollback
        setTasks(previousTasksRef.current);
        const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
        showToastSafe(errorMessage, 'error');
      }
    },
    [tasks]
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
        joinProjectRoom,
        leaveProjectRoom,
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
