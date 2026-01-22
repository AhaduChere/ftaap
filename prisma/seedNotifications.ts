import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedNotifications() {
  try {

    await prisma.studentNotification.deleteMany({});

    // Pick the 5 students you want notifications for
    const students = await prisma.student.findMany({
      where: { student_id: { in: [11, 12, 14, 13, 10, 7, 3] } },
    });

  const notifications = students.map((s, index) => ({
    id: s.student_id * 100 + index, // or any logic to get unique IDs
    student_id: s.student_id,
    name: `${s.student_fname} ${s.student_lname}`,
    level: 'red',
    message: 'Dropped from Danger to Struggling',
    read: false,
    timestamp: new Date(),
  }));

    // Insert notifications
    await prisma.studentNotification.createMany({ data: notifications });

    console.log('Seeded notifications');
  } catch (err) {
    console.error('Failed to seed notifications:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seedNotifications();