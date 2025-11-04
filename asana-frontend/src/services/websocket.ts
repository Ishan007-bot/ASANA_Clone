// WebSocket Service for Real-time Updates using Socket.io
import { io, Socket } from 'socket.io-client';

type MessageHandler = (data: any) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private handlers = new Map<string, Set<MessageHandler>>();
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  constructor() {
    const wsProtocol = window.location.protocol === 'https:' ? 'https' : 'http';
    const wsHost = import.meta.env.VITE_WS_URL || 'localhost:8000';
    this.url = `${wsProtocol}://${wsHost}`;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        // Wait for existing connection attempt
        const checkInterval = setInterval(() => {
          if (!this.isConnecting) {
            clearInterval(checkInterval);
            if (this.socket?.connected) {
              resolve();
            } else {
              reject(new Error('Connection failed'));
            }
          }
        }, 100);
        return;
      }

      this.isConnecting = true;

      try {
        const token = localStorage.getItem('auth_token');
        
        this.socket = io(this.url, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: 1000,
          auth: token ? { token } : undefined,
        });

        this.socket.on('connect', () => {
          console.log('✅ Socket.io connected:', this.socket?.id);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Socket.io connection error:', error);
          this.isConnecting = false;
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            reject(error);
          }
        });

        this.socket.on('disconnect', (reason) => {
          console.log('🔌 Socket.io disconnected:', reason);
          this.isConnecting = false;
          if (reason === 'io server disconnect') {
            // Server disconnected, reconnect manually
            this.socket?.connect();
          }
        });

        // Handle all incoming events
        this.setupEventListeners();
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Listen for task events (with colons as backend emits)
    this.socket.on('task:created', (data: any) => {
      this.handleMessage('task:created', data);
    });

    this.socket.on('task:updated', (data: any) => {
      this.handleMessage('task:updated', data);
    });

    this.socket.on('task:moved', (data: any) => {
      this.handleMessage('task:moved', data);
    });

    this.socket.on('task:deleted', (data: any) => {
      this.handleMessage('task:deleted', data);
    });

    // Also support underscore format for backwards compatibility
    this.socket.on('task_created', (data: any) => {
      this.handleMessage('task_created', data);
    });

    this.socket.on('task_updated', (data: any) => {
      this.handleMessage('task_updated', data);
    });

    this.socket.on('task_deleted', (data: any) => {
      this.handleMessage('task_deleted', data);
    });

    // Error events
    this.socket.on('error', (data: any) => {
      console.error('Socket.io error:', data);
      this.handleMessage('error', data);
    });
  }

  private handleMessage(eventType: string, data: any) {
    // Try both colon and underscore formats
    const handlers = this.handlers.get(eventType) || this.handlers.get(eventType.replace(':', '_'));
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    }
  }

  // Join a project room for real-time updates
  joinProject(projectId: string) {
    if (this.socket?.connected) {
      this.socket.emit('project:join', { projectId });
      console.log(`✅ Joined project room: ${projectId}`);
    } else {
      console.warn('Socket not connected, cannot join project room');
    }
  }

  // Leave a project room
  leaveProject(projectId: string) {
    if (this.socket?.connected) {
      this.socket.emit('project:leave', { projectId });
      console.log(`❌ Left project room: ${projectId}`);
    }
  }

  // Send task creation via WebSocket (for optimistic UI)
  createTaskViaSocket(tempId: string, task: any) {
    if (this.socket?.connected) {
      this.socket.emit('task:create', { tempId, task });
    } else {
      console.warn('Socket not connected, cannot create task via WebSocket');
    }
  }

  // Send task update via WebSocket
  updateTaskViaSocket(taskId: string, updates: any) {
    if (this.socket?.connected) {
      this.socket.emit('task:update', { taskId, updates });
    } else {
      console.warn('Socket not connected, cannot update task via WebSocket');
    }
  }

  // Send task move via WebSocket
  moveTaskViaSocket(taskId: string, newSectionId: string | null, newPosition: number) {
    if (this.socket?.connected) {
      this.socket.emit('task:move', { taskId, newSectionId, newPosition });
    } else {
      console.warn('Socket not connected, cannot move task via WebSocket');
    }
  }

  // Send task delete via WebSocket
  deleteTaskViaSocket(taskId: string) {
    if (this.socket?.connected) {
      this.socket.emit('task:delete', { taskId });
    } else {
      console.warn('Socket not connected, cannot delete task via WebSocket');
    }
  }

  subscribe(eventType: string, handler: MessageHandler): () => void {
    // Support both colon and underscore formats
    const normalizedType = eventType.replace('_', ':');
    
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    if (!this.handlers.has(normalizedType)) {
      this.handlers.set(normalizedType, new Set());
    }
    
    this.handlers.get(eventType)!.add(handler);
    this.handlers.get(normalizedType)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(eventType);
      const normalizedHandlers = this.handlers.get(normalizedType);
      
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(eventType);
        }
      }
      
      if (normalizedHandlers) {
        normalizedHandlers.delete(handler);
        if (normalizedHandlers.size === 0) {
          this.handlers.delete(normalizedType);
        }
      }
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.handlers.clear();
  }

  getReadyState(): string {
    if (!this.socket) return 'disconnected';
    if (this.socket.connected) return 'connected';
    return 'connecting';
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const wsService = new WebSocketService();
