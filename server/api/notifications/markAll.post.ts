import { prisma } from '../../prisma';

export default defineEventHandler(async () => {
  try {
    const info = await prisma.studentNotification.updateMany({
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
