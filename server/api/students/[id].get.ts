import { supabase } from '../../supabase.js';
import { defineEventHandler, createError } from 'h3';

function toFrontend(s: Student) {
  return {
    id: s.student_id,
    firstName: s.student_fname ?? '',
    lastName: s.student_lname ?? '',
    gradeLevel:
      s.student_grade_level !== null && s.student_grade_level !== undefined
        ? Number(s.student_grade_level)
        : null,
    program: s.student_program ?? null,
    isArchived: s.is_archived ?? false,
  };
}

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;
  const id = Number(idParam);

  if (!id || Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid student id.',
    });
  }

  const { data: student, error } = await supabase
    .from('Student')
    .select('*')
    .eq('student_id', id)
    .single();

  if (error || !student) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Student not found.',
    });
  }

  return toFrontend(student);
});
