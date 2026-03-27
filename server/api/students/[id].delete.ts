// [id].delete.ts
// API handler for archiving a student.
// This endpoint handles:
// - validating that the request method is DELETE
// - validating the provided student id parameter
// - checking whether the student exists
// - soft deleting the student by marking them as archived
// - returning a success response or throwing an API error


import { supabase } from '../../supabase.js';
import { defineEventHandler, getMethod, createError } from 'h3';

export default defineEventHandler(async (event) => {
  // Get the HTTP method used for this request
  const method = getMethod(event);

  // Only allow DELETE requests for this endpoint
  if (method !== 'DELETE') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }

  // Read the student id from route params
  const idParam = event.context.params?.id;
  const id = Number(idParam);

  // Validate that the id is a usable number
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

  // Return not found if no matching student exists
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

  // Handle database update failure
  if (updateError) {
    console.error('Error archiving student:', updateError);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to archive student',
    });
  }

  // Return success response
  return { success: true };
});