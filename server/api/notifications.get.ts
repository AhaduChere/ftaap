import { prisma } from '../prisma';

export default defineEventHandler(async () => {
  try {
    const notifications = await prisma.studentNotification.findMany({
      where: { read: false },
      orderBy: { timestamp: 'desc' },
      include: {
        Student: true,
      },
    });


    const serialized = notifications.map((n) => ({
      id: n.id,
      student_id: n.student_id?.toString?.() ?? null,
      message: n.message,
      read: n.read,
      timestamp: n.timestamp?.toISOString?.() ?? null,
      level: 'red', 
      name: n.Student ? `${n.Student.student_fname ?? ''} ${n.Student.student_lname ?? ''}`.trim() : 'Unknown',
    }));

    return serialized;
  } catch (err) {
    console.error('Error fetching notifications:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch notifications',
    });
  }
});
