import { supabase } from '../../../supabase.js'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id
  const id = Number(idParam)

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

  if (fetchError || !existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Student not found.',
    })
  }

  if (!existing.is_archived) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Only archived students can be permanently deleted.',
    })
  }

  const { error: deleteError } = await supabase
    .from('Student')
    .delete()
    .eq('student_id', id)

  if (deleteError) {
    console.error('Error permanently deleting student:', deleteError)
    throw createError({
      statusCode: 500,
      statusMessage:
        'Failed to permanently delete student. If this student has related records, you may need ON DELETE CASCADE.',
    })
  }

  return { ok: true }
})
