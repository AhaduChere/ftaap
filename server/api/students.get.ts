import { supabase } from '../supabase.js';

function toFrontend(s: any) {
  return {
    id: Number(s.student_id),
    firstName: s.student_fname ?? '',
    lastName: s.student_lname ?? '',
    gradeLevel:
      s.student_grade_level !== null && s.student_grade_level !== undefined
        ? Number(s.student_grade_level)
        : null,
    program: s.student_program ?? null,
    notes: s.student_notes ?? null,
    isArchived: s.is_archived ?? false,
  };
}

export default defineEventHandler(async () => {
  try {
    const { data: rows, error } = await supabase
      .from('Student')
      .select('*')
      .or('is_archived.eq.false,is_archived.is.null')
      .order('student_lname', { ascending: true })
      .order('student_fname', { ascending: true });

    if (error) throw error;

    return rows.map(toFrontend);
  } catch (err) {
    console.error('Error fetching students:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch students',
    });
  }
});
