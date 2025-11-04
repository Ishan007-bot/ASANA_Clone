import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import sql from './db.js';

// Import modular routes
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import teamRoutes from './src/routes/teams.js';
import projectRoutes from './src/routes/projects.js';
import taskRoutes from './src/routes/tasks.js';
import commentRoutes from './src/routes/comments.js';
import seedRoutes from './src/routes/seed.js';
import sectionRoutes from './src/routes/sections.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

// Database connections
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8000;

// Test database connection using db.js
async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection via db.js...');
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful via db.js!');
    console.log('   Connection test result:', result[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed via db.js:', error.message);
    return false;
  }
}

// Test connection on startup
testDatabaseConnection();

// Middleware
app.use(cors());
app.use(express.json());

// ========================================
// STATISTICAL LATENCY MIDDLEWARE
// ========================================
// Adds 1-2 second delay to all GET routes to simulate real-world latency
app.use((req, res, next) => {
  if (req.method === 'GET') {
    const delay = Math.random() * 1000 + 1000; // Random delay between 1000-2000ms
    setTimeout(() => next(), delay);
  } else {
    next();
  }
});

// ========================================
// ROOT ROUTE
// ========================================
app.get('/', (req, res) => {
  res.json({
    message: 'Asana Clone API Server',
    version: '1.0.0',
      endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      teams: '/api/teams',
      projects: '/api/projects',
      tasks: '/api/tasks',
      comments: '/api/comments',
      sections: '/api/sections',
      seed: '/api/seed (POST)',
    },
    websocket: {
      url: `http://localhost:${PORT}`,
      events: ['project:join', 'task:create', 'task:update', 'task:move', 'task:delete'],
    },
  });
});

// ========================================
// REST API ROUTES
// ========================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/seed', seedRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Asana Clone API Server' });
});

// ========================================
// SOCKET.IO REAL-TIME API
// ========================================

// Helper function to transform task for Socket.io
const transformTask = (task) => ({
  id: task.id,
  name: task.name,
  description: task.description,
  completed: task.completed,
  dueDate: task.dueDate?.toISOString(),
  assignee: task.assignee?.name || task.assignee?.email || task.assigneeId,
  projectId: task.projectId,
  sectionId: task.sectionId,
  priority: task.priority,
  tags: task.tags,
  position: task.position,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
  subtasks: task.subtasks?.map(transformTask) || [],
});

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Join project room for real-time updates
  socket.on('project:join', (data) => {
    const { projectId } = data;
    if (projectId) {
      socket.join(projectId);
      console.log(`✅ Socket ${socket.id} joined project room: ${projectId}`);
    }
  });

  // Leave project room
  socket.on('project:leave', (data) => {
    const { projectId } = data;
    if (projectId) {
      socket.leave(projectId);
      console.log(`❌ Socket ${socket.id} left project room: ${projectId}`);
    }
  });

  // Create task via WebSocket (with optimistic UI support)
  socket.on('task:create', async (data) => {
    try {
      const { tempId, task } = data;
      const {
        name,
        description,
        project_id,
        section_id,
        due_date,
        assignee_id,
        priority,
        tags,
        completed,
      } = task;

      const newTask = await prisma.task.create({
        data: {
          name,
          description,
          projectId: project_id,
          sectionId: section_id,
          dueDate: due_date ? new Date(due_date) : null,
          assigneeId: assignee_id,
          priority: priority || 'medium',
          tags: tags || [],
          completed: completed || false,
        },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          section: {
            select: {
              id: true,
              name: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          subtasks: true,
        },
      });

      const transformedTask = transformTask(newTask);

      // Broadcast to room (excluding sender to avoid duplicate updates)
      if (newTask.projectId) {
        socket.broadcast.to(newTask.projectId).emit('task:created', {
          task: transformedTask,
        });

        // Send confirmation to sender with tempId for optimistic UI matching
        socket.emit('task:created', {
          task: transformedTask,
          tempId, // Frontend uses this to replace temp task with real one
        });
      }
    } catch (error) {
      console.error('Error creating task via socket:', error);
      socket.emit('error', { message: 'Failed to create task' });
    }
  });

  // Update task via WebSocket
  socket.on('task:update', async (data) => {
    try {
      const { taskId, updates } = data;

      const updateData = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.project_id !== undefined) updateData.projectId = updates.project_id;
      if (updates.section_id !== undefined) updateData.sectionId = updates.section_id;
      if (updates.due_date !== undefined) updateData.dueDate = updates.due_date ? new Date(updates.due_date) : null;
      if (updates.assignee_id !== undefined) updateData.assigneeId = updates.assignee_id;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.completed !== undefined) updateData.completed = updates.completed;

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          section: {
            select: {
              id: true,
              name: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          subtasks: true,
        },
      });

      const transformedTask = transformTask(updatedTask);

      // Broadcast to room
      if (updatedTask.projectId) {
        io.to(updatedTask.projectId).emit('task:updated', {
          task: transformedTask,
        });
      }
    } catch (error) {
      console.error('Error updating task via socket:', error);
      socket.emit('error', { message: 'Failed to update task' });
    }
  });

  // Move task (drag-and-drop, reorder)
  socket.on('task:move', async (data) => {
    try {
      const { taskId, newSectionId, newPosition } = data;

      const task = await prisma.task.update({
        where: { id: taskId },
        data: {
          sectionId: newSectionId || undefined,
          position: newPosition,
        },
        include: {
          project: {
            select: {
              id: true,
            },
          },
        },
      });

      // Broadcast move event to room
      if (task.projectId) {
        io.to(task.projectId).emit('task:moved', {
          taskId,
          newSectionId: task.sectionId,
          newPosition: task.position,
        });
      }
    } catch (error) {
      console.error('Error moving task via socket:', error);
      socket.emit('error', { message: 'Failed to move task' });
    }
  });

  // Delete task via WebSocket
  socket.on('task:delete', async (data) => {
    try {
      const { taskId } = data;

      const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { projectId: true },
      });

      if (!task) {
        socket.emit('error', { message: 'Task not found' });
        return;
      }

      await prisma.task.delete({
        where: { id: taskId },
      });

      // Broadcast to room
      if (task.projectId) {
        io.to(task.projectId).emit('task:deleted', {
          taskId,
        });
      }
    } catch (error) {
      console.error('Error deleting task via socket:', error);
      socket.emit('error', { message: 'Failed to delete task' });
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// ========================================
// START SERVER
// ========================================

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io server ready for real-time updates`);
  console.log(`⏱️  Statistical latency enabled (1-2s delay on GET routes)`);
  console.log(`🔐 JWT Authentication enabled`);
});
