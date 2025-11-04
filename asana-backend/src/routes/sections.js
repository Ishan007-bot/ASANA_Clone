import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get sections for a project
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const sections = await prisma.section.findMany({
      where: { projectId },
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
          },
          orderBy: [
            { position: 'asc' },
            { createdAt: 'desc' },
          ],
        },
      },
      orderBy: { position: 'asc' },
    });

    res.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
});

// Create section
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { project_id, name, position } = req.body;

    if (!project_id || !name) {
      return res.status(400).json({ error: 'Project ID and name are required' });
    }

    // Get max position if not provided
    let sectionPosition = position;
    if (sectionPosition === undefined) {
      const maxSection = await prisma.section.findFirst({
        where: { projectId: project_id },
        orderBy: { position: 'desc' },
      });
      sectionPosition = maxSection ? maxSection.position + 1 : 0;
    }

    const section = await prisma.section.create({
      data: {
        projectId: project_id,
        name,
        position: sectionPosition,
      },
    });

    res.status(201).json(section);
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ error: 'Failed to create section' });
  }
});

// Update section
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (position !== undefined) updateData.position = position;

    const section = await prisma.section.update({
      where: { id },
      data: updateData,
    });

    res.json(section);
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ error: 'Failed to update section' });
  }
});

// Delete section
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get section to check if it has tasks
    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    // If section has tasks, set their sectionId to null instead of deleting
    if (section._count.tasks > 0) {
      await prisma.task.updateMany({
        where: { sectionId: id },
        data: { sectionId: null },
      });
    }

    await prisma.section.delete({
      where: { id },
    });

    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ error: 'Failed to delete section' });
  }
});

export default router;

