import { prisma } from '../../prisma';

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;
  if (!idParam) throw createError({ statusCode: 400, statusMessage: 'Missing ID' });

  const id = Number(idParam); 
  try {
    await prisma.studentNotification.update({
      where: { id },
      data: { read: true },
    });

    return { success: true };
  } catch (err) {
    console.error('Error marking notification as read:', err);
    throw createError({ statusCode: 500, statusMessage: 'Failed to mark as read' });
  }
});