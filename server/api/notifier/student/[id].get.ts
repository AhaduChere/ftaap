import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
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
