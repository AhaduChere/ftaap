import { supabase } from '../supabase.js';
import { createError, defineEventHandler } from 'h3';

export default defineEventHandler(async () => {
  try {
    const { data: students, error } = await supabase
      .from('Student')
      .select(`
        *,
        Student_Score_Student_student_score_idToStudent_Score(*)
      `);

    if (error) throw error;

    return students.map((s: any) => ({
      id: s.student_id,
      firstName: s.student_fname || '',
      lastName: s.student_lname || '',
      gradeLevel: s.student_grade_level ?? null,
      program: s.student_program || '',
      notes: s.student_notes ?? '',
      isArchived: s.is_archived ?? false,
      score: s.Student_Score_Student_student_score_idToStudent_Score
        ? s.Student_Score_Student_student_score_idToStudent_Score.student_dibel_score
        : null,
    }));
  } catch (err) {
    console.error('Failed to fetch students:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch students',
    });
  }
});
