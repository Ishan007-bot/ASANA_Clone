import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // RL Environment: Accept mock token for development/testing
    if (token === 'rl-env-token') {
      // Create a mock user for RL environment
      req.user = {
        id: 'rl-user-1',
        email: 'rl-user@example.com',
        name: 'RL User',
        initials: 'RU',
        avatarUrl: null,
        theme: 'dark',
      };
      return next();
    }

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');

    // Get user from database using Prisma
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        initials: true,
        avatarUrl: true,
        theme: true,
      },
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};


