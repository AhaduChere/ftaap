import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const info = await prisma.student_Notification.updateMany({
      where: { read: false },
      data: { read: true },
    });

    console.log('🔍 DB update result for all notifications:', info);
    return { success: info.count > 0 };
  } catch (err) {
    console.error('Failed to mark all notifications as read', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to mark all as read',
    });
  }
});
