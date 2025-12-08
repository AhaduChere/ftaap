import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const serialized = notifications.map((n: { id: { toString: () => any; }; student_id: { toString: () => any; }; message: any; read: any; timestamp: { toISOString: () => any; }; Student: { student_fname: any; student_lname: any; }; }) => ({
      id: n.id.toString(),
      student_id: n.student_id?.toString() ?? null,
      message: n.message,
      read: n.read,
      timestamp: n.timestamp.toISOString(),
      level: 'red', // if you don’t have a level column, you can hardcode for now
      name: n.Student ? `${n.Student.student_fname} ${n.Student.student_lname}` : 'Unknown',
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
