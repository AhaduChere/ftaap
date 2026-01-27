import { supabase } from '../../../supabase.js';
import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;
  const id = Number(idParam);

  if (!id || Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid student id.',
    });
  }

  // Check if student exists
  const { data: existing, error: fetchError } = await supabase
    .from('Student')
    .select('student_id')
    .eq('student_id', id)
    .single();

  if (fetchError || !existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Student not found.',
    });
  }

  // Un-archive the student
  const { error: updateError } = await supabase
    .from('Student')
    .update({ is_archived: false })
    .eq('student_id', id);

  if (updateError) {
    console.error('Error unarchiving student:', updateError);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to unarchive student',
    });
  }

  return { success: true };
});
