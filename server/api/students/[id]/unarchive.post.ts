// unarchive.post.ts
// API handler for restoring an archived student.
// This endpoint handles:
// - validating the provided student id parameter
// - checking whether the student exists
// - un-archiving the student by setting is_archived to false
// - returning a success response or throwing an API error


import { supabase } from '../../../supabase.js';
import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
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

  // Un-archive the student
  const { error: updateError } = await supabase
    .from('Student')
    .update({ is_archived: false })
    .eq('student_id', id);

  // Handle database update failure
  if (updateError) {
    console.error('Error unarchiving student:', updateError);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to unarchive student',
    });
  }

  // Return success response
  return { success: true };
});