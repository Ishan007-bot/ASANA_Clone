import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { extractMentions } from '../utils/mentions.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get comments for a task
router.get('/task/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const comments = await prisma.comment.findMany({
      where: {
        taskId,
        parentCommentId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            initials: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: { replies: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Get replies for each comment
    for (const comment of comments) {
      const replies = await prisma.comment.findMany({
        where: { parentCommentId: comment.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              initials: true,
            },
          },
          reactions: {
            include: {
              user: {
                select: { id: true, name: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
      comment.replies = replies;
    }

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Create comment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { task_id, parent_comment_id, content } = req.body;

    const comment = await prisma.comment.create({
      data: {
        taskId: task_id,
        parentCommentId: parent_comment_id || null,
        userId: req.user.id,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            initials: true,
          },
        },
        reactions: true,
      },
    });

    // Extract mentions and create notifications (if needed)
    const mentions = extractMentions(content);

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Update comment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Check ownership
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (existingComment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this comment' });
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            initials: true,
          },
        },
      },
    });

    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete comment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id },
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Add/remove reaction
router.post('/:id/reactions', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;

    // Check if reaction exists
    const existing = await prisma.commentReaction.findUnique({
      where: {
        commentId_userId_emoji: {
          commentId: id,
          userId: req.user.id,
          emoji,
        },
      },
    });

    if (existing) {
      // Remove reaction
      await prisma.commentReaction.delete({
        where: {
          commentId_userId_emoji: {
            commentId: id,
            userId: req.user.id,
            emoji,
          },
        },
      });
      res.json({ message: 'Reaction removed' });
    } else {
      // Add reaction
      await prisma.commentReaction.create({
        data: {
          commentId: id,
          userId: req.user.id,
          emoji,
        },
      });
      res.json({ message: 'Reaction added' });
    }
  } catch (error) {
    console.error('Error updating reaction:', error);
    res.status(500).json({ error: 'Failed to update reaction' });
  }
});

export default router;


