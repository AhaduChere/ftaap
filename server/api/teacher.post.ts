import { PrismaClient } from '../../app/generated/prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { teacherid } = body;

  if (!teacherid) {
    return { success: false, message: 'Missing ID' };
  }

  try {
    await prisma.students.updateMany({
      where: {
        TeacherID: teacherid,
      },
      data: {
        TeacherID: null,
      },
    });

    await prisma.teachers.delete({
      where: {
        id: teacherid,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to delete teacher' + error };
  }
});
