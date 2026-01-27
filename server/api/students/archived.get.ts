import { supabase } from '../../supabase.js';
import { defineEventHandler } from 'h3';

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
    isArchived: s.is_archived ?? false,
  };
}

export default defineEventHandler(async () => {
  const { data: rows, error } = await supabase
    .from('Student')
    .select('*')
    .eq('is_archived', true)
    .order('student_lname', { ascending: true })
    .order('student_fname', { ascending: true });

  if (error) {
    console.error('Error fetching archived students:', error);
    return [];
  }

  return rows.map(toFrontend);
});
