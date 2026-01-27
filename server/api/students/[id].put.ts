import { supabase } from '../../supabase.js';
import { readBody, createError, defineEventHandler } from 'h3';

function toFrontend(s: any) {
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

  const { data: existing, error: fetchError } = await supabase
    .from('Student')
    .select('*')
    .eq('student_id', id)
    .single();

  if (fetchError || !existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Student not found.',
    });
  }

  type Body = {
    firstName?: string;
    lastName?: string;
    gradeLevel?: number | null;
    program?: string | null;
    isArchived?: boolean | null;
  };

  const body = await readBody<Body>(event);

  const updateData: any = {
    student_fname: body.firstName ?? existing.student_fname,
    student_lname: body.lastName ?? existing.student_lname,
    student_grade_level:
      body.gradeLevel !== undefined ? body.gradeLevel : existing.student_grade_level,
    student_program: body.program ?? existing.student_program,
    is_archived: body.isArchived ?? existing.is_archived,
  };

  const { data: updated, error: updateError } = await supabase
    .from('Student')
    .update(updateData)
    .eq('student_id', id)
    .select()
    .single();

  if (updateError || !updated) {
    console.error('Error updating student:', updateError);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update student',
    });
  }

  return toFrontend(updated);
});
