import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/activity.js';

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to transform task
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

// Get all tasks with optional filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      project_id,
      assignee_id,
      completed,
      search,
      priority,
      due_date_start,
      due_date_end,
    } = req.query;

    let where = {};

    if (project_id) where.projectId = project_id;
    if (assignee_id) where.assigneeId = assignee_id;
    if (completed !== undefined) where.completed = completed === 'true';
    if (priority) where.priority = priority;

    if (due_date_start || due_date_end) {
      where.dueDate = {};
      if (due_date_start) where.dueDate.gte = new Date(due_date_start);
      if (due_date_end) where.dueDate.lte = new Date(due_date_end);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
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
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json(tasks.map(transformTask));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get task by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
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

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(transformTask(task));
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create task
router.post('/', authenticateToken, async (req, res) => {
  try {
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
    } = req.body;

    const task = await prisma.task.create({
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
        creatorId: req.user.id,
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
      },
    });

    // Log activity
    await logActivity(task.id, req.user.id, 'created', { taskName: task.name });

    res.status(201).json(transformTask(task));
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
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
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (project_id !== undefined) updateData.projectId = project_id;
    if (section_id !== undefined) updateData.sectionId = section_id;
    if (due_date !== undefined) updateData.dueDate = due_date ? new Date(due_date) : null;
    if (assignee_id !== undefined) updateData.assigneeId = assignee_id;
    if (priority !== undefined) updateData.priority = priority;
    if (tags !== undefined) updateData.tags = tags;
    if (completed !== undefined) {
      updateData.completed = completed;
      if (completed) {
        updateData.completedAt = new Date();
        updateData.completedBy = req.user.id;
      } else {
        updateData.completedAt = null;
        updateData.completedBy = null;
      }
    }

    const task = await prisma.task.update({
      where: { id: req.params.id },
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
      },
    });

    // Log activity
    await logActivity(task.id, req.user.id, 'updated', updateData);

    res.json(transformTask(task));
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      select: { projectId: true, name: true },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id: req.params.id },
    });

    // Log activity
    await logActivity(req.params.id, req.user.id, 'deleted', { taskName: task.name });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Reorder tasks
router.post('/reorder', authenticateToken, async (req, res) => {
  try {
    const { taskIds } = req.body; // Array of task IDs in new order

    // Update positions
    const updates = taskIds.map((taskId, index) =>
      prisma.task.update({
        where: { id: taskId },
        data: { position: index },
      })
    );

    await Promise.all(updates);

    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    res.status(500).json({ error: 'Failed to reorder tasks' });
  }
});

export default router;


