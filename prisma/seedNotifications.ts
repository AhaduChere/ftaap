import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedNotifications() {
  try {
    // Pick the 5 students you want notifications for
    const students = await prisma.student.findMany({
      where: { student_id: { in: [3, 4, 7, 9, 11] } },
    });

    const notifications = students.map(s => ({
      student_id: s.student_id,
      name: `${s.student_fname} ${s.student_lname}`,
      level: 'red',
      message: 'Dropped from Danger to Struggling',
      read: false,
      timestamp: new Date(),
    }));

    // Insert notifications
    await prisma.student_Notification.createMany({ data: notifications });

    console.log('✅ Seeded notifications');
  } catch (err) {
    console.error('Failed to seed notifications:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seedNotifications();
