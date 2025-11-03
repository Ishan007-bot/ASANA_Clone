import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logActivity = async (taskId, userId, actionType, actionDetails = {}) => {
  try {
    await prisma.activityLog.create({
      data: {
        taskId,
        userId,
        actionType,
        actionDetails,
      },
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - activity logging shouldn't break the main operation
  }
};


