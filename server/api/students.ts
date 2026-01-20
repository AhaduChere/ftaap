import { prisma } from '../prisma';

export default defineEventHandler(async () => {
  try {
    const students = await prisma.student.findMany({
      include: {
        Student_Score_Student_student_score_idToStudent_Score: true, // include the correct relation
      },
    });

    // Map the data for the frontend
  return students.map((s) => ({
    id: s.student_id,
    firstName: s.student_fname || '',
    lastName: s.student_lname || '',
    gradeLevel: s.student_grade_level ?? null,
    program: s.student_program || '',
    notes: s.student_notes ?? '',
    isArchived: s.is_archived ?? false,
    score: s.Student_Score_Student_student_score_idToStudent_Score
            ? s.Student_Score_Student_student_score_idToStudent_Score.student_dibel_score
            : null, // null if no score
  }));
  } catch (err) {
    console.error('Failed to fetch students:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch students',
    });
  }
});
