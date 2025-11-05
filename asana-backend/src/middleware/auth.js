import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // RL Environment: Accept mock token for development/testing
    if (token === 'rl-env-token') {
      // Use a real user from database for RL environment (preferably test user)
      let user = await prisma.user.findFirst({
        where: {
          email: 'test@example.com',
        },
        select: {
          id: true,
          email: true,
          name: true,
          initials: true,
          avatarUrl: true,
          theme: true,
        },
      });

      // If no test user exists, get the first user from the database
      if (!user) {
        user = await prisma.user.findFirst({
          select: {
            id: true,
            email: true,
            name: true,
            initials: true,
            avatarUrl: true,
            theme: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        });
      }

      // If still no user, create a default RL user
      if (!user) {
        const passwordHash = await bcrypt.hash('password', 10);
        user = await prisma.user.create({
          data: {
            email: 'rl-user@example.com',
            name: 'RL User',
            initials: 'RU',
            passwordHash,
            theme: 'dark',
          },
          select: {
            id: true,
            email: true,
            name: true,
            initials: true,
            avatarUrl: true,
            theme: true,
          },
        });
      }

      req.user = user;
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


