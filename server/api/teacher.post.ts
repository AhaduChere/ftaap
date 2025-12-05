import { PrismaClient } from '../../app/generated/prisma/client';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = new PrismaClient();
  const { teacherid } = body;

  if (!teacherid) {
    return { success: false, message: 'Missing ID' };
  }

  try {
    await prisma.student.updateMany({
      where: {
        teacher_id: teacherid,
      },
      data: {
        teacher_id: null,
      },
    });

    await prisma.teacher.delete({
      where: {
        teacher_id: teacherid,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to delete teacher' + error };
  }
});
