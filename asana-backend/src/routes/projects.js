import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { team_id, workspace_id, search } = req.query;

    let where = {};
    if (team_id) where.teamId = team_id;
    if (workspace_id) where.workspaceId = workspace_id;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        team: {
          select: { id: true, name: true },
        },
        workspace: {
          select: { id: true, name: true },
        },
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get project with sections and tasks
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        sections: {
          include: {
            tasks: {
              include: {
                assignee: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                subtasks: true,
              },
              orderBy: [
                { position: 'asc' },
                { createdAt: 'desc' },
              ],
            },
          },
          orderBy: { position: 'asc' },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                initials: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Transform to match frontend expectations
    const transformedProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      sections: project.sections.map((section) => ({
        id: section.id,
        name: section.name,
        position: section.position,
        tasks: section.tasks.map((task) => ({
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
          subtasks: task.subtasks?.map((st) => ({
            id: st.id,
            name: st.name,
            description: st.description,
            completed: st.completed,
            dueDate: st.dueDate?.toISOString(),
            assignee: st.assigneeId,
            projectId: st.projectId,
            sectionId: st.sectionId,
            priority: st.priority,
            tags: st.tags,
            createdAt: st.createdAt.toISOString(),
            updatedAt: st.updatedAt.toISOString(),
          })) || [],
        })),
      })),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };

    res.json(transformedProject);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { team_id, workspace_id, name, description, color, icon, view_type } = req.body;

    const project = await prisma.project.create({
      data: {
        teamId: team_id || null,
        workspaceId: workspace_id || null,
        name,
        description: description || null,
        color: color || null,
        icon: icon || null,
        viewType: view_type || 'list',
        ownerId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: 'admin',
          },
        },
      },
      include: {
        team: true,
        workspace: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                initials: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, icon, view_type } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;
    if (view_type !== undefined) updateData.viewType = view_type;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;


