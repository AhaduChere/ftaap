// purge.delete.ts
// API handler for permanently deleting an archived student.
// This endpoint handles:
// - validating the provided student id parameter
// - checking whether the student exists
// - ensuring only archived students can be purged
// - permanently deleting the student record from the database
// - returning a success response or throwing an API error


import { supabase } from '../../../supabase.js'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  // Read the student id from route params
  const idParam = event.context.params?.id
  const id = Number(idParam)

  // Validate that the id is a usable number
  if (!id || Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid student id.',
    })
  }

  // Safety: only allow purging archived students
  const { data: existing, error: fetchError } = await supabase
    .from('Student')
    .select('student_id, is_archived')
    .eq('student_id', id)
    .single()

  // Return not found if no matching student exists
  if (fetchError || !existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Student not found.',
    })
  }

  // Prevent permanent deletion of non-archived students
  if (!existing.is_archived) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Only archived students can be permanently deleted.',
    })
  }

  // Permanently delete the student row
  const { error: deleteError } = await supabase
    .from('Student')
    .delete()
    .eq('student_id', id)

  // Handle database delete failure
  if (deleteError) {
    console.error('Error permanently deleting student:', deleteError)
    throw createError({
      statusCode: 500,
      statusMessage:
        'Failed to permanently delete student. If this student has related records, you may need ON DELETE CASCADE.',
    })
  }

  // Return success response
  return { ok: true }
})