import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
const prisma = new PrismaClient();
  const student_id = Number(event.context.params?.id);
  if (!student_id) {
   console.log('400 Bad Request');
  }

  const student = await prisma.student.findUnique({
    where: { student_id },
  });

  if (!student) {
    console.log('404 Error, student Id not found');
  }
  return student;
});
