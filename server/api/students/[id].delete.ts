import { supabase } from '../../supabase.js';
import { defineEventHandler, getMethod, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method !== 'DELETE') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }

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

  // Soft delete → mark as archived
  const { error: updateError } = await supabase
    .from('Student')
    .update({ is_archived: true })
    .eq('student_id', id);

  if (updateError) {
    console.error('Error archiving student:', updateError);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to archive student',
    });
  }

  return { success: true };
});
