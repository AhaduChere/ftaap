import { PrismaClient } from '../../app/generated/prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { teacherid } = body;

  if (!teacherid) {
    return { success: false, message: 'Missing ID' };
  }

  try {
    const student = await prisma.students.updateMany({
      where: {
        TeacherID: teacherid,
      },
      data: {
        TeacherID: null,
      },
    });

    const teacher = await prisma.teachers.delete({
      where: {
        id: teacherid,
      },
    });

    console.log(student + ' ' + teacher);

    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to delete teacher' + error };
  }
});
