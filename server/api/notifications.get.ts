import { prisma } from '../prisma';

export default defineEventHandler(async () => {
  try {
    const notifications = await prisma.student_Notification.findMany({
      where: { read: false },
      orderBy: { timestamp: 'desc' },
      include: {
        Student: true, // optional, if you want student info like name
      },
    });

    // Convert BigInt fields to strings
    const serialized = notifications.map((n) => ({
      id: n.id?.toString?.() ?? null,
      student_id: n.student_id?.toString?.() ?? null,
      message: n.message,
      read: n.read,
      timestamp: n.timestamp?.toISOString?.() ?? null,
      level: 'red', // if you don’t have a level column, you can hardcode for now
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