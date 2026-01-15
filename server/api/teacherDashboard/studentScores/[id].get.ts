import { PrismaClient } from '@prisma/client' ;
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const student_id = Number(event.context.params?.id);
  if (!student_id) {
    console.log('400 Bad Request');
    return { error: 'Invalid student_id' };
  }

  const studentScores = await prisma.student_Score.findMany({
    where: { student_id },
  });

  if (!studentScores) {
    console.error('404 Error, student Id not found');
    return { error: 'Student not found' };
  }

  return studentScores;
  
});
