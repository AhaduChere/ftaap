import { prisma } from '../prisma';

export default defineEventHandler(async (event) => {
  try {
    const students = await prisma.student.findMany({
      include: { Student_Score: true }, // include the related score
    });

    // Serialize BigInt to string if needed
    const serialized = students.map((s: any) => ({
      student_id: s.student_id.toString(),
      student_fname: s.student_fname || '',
      student_lname: s.student_lname || '',
      Student_Score: s.Student_Score
        ? {
            student_dibel_score: s.Student_Score.student_dibel_score || 0,
            student_fluency_score: s.Student_Score.student_fluency_score || 0,
          }
        : null,
    }));

    return serialized;
  } catch (err) {
    console.error('Failed to fetch students:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch students',
    });
  }
});