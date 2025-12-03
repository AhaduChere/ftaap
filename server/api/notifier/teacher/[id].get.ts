import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const teacher_id = Number(event.context.params?.id);

  if (!teacher_id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid ID' });
  }

  const teacher = await prisma.teacher.findUnique({
    where: { teacher_id },
  });

  if (!teacher) {
    throw createError({ statusCode: 404, statusMessage: 'Record not found' });
  }

  return teacher;
});
