// [id].put.ts
// API handler for updating an existing student.
// This endpoint handles:
// - validating the student id parameter
// - checking if the student exists
// - reading and validating update fields from the request body
// - updating only provided fields in the database
// - returning the updated student in frontend-friendly format


import { supabase } from '../../supabase.js'
import { readBody, createError, defineEventHandler } from 'h3'
import type { Student } from '../../../types/student.js'

// Converts a database student row into a frontend-friendly format
function toFrontend(s: Student) {
  return {
    id: Number(s.student_id), // normalize id
    firstName: s.student_fname ?? '', // fallback empty string
    lastName: s.student_lname ?? '', // fallback empty string
    gradeLevel:
      s.student_grade_level !== null && s.student_grade_level !== undefined
        ? Number(s.student_grade_level)
        : null, // normalize grade
    program: s.student_program ?? null,

    // Normalize organization id
    organizationId:
      s.organization_id !== null && s.organization_id !== undefined
        ? Number(s.organization_id)
        : null,

    // Normalize notes field
    notes: s.student_notes ?? null,

    // Normalize archive status
    isArchived: s.is_archived ?? false,

    // Normalize teacher id
    teacherId:
      s.teacher_id !== null && s.teacher_id !== undefined
        ? Number(s.teacher_id)
        : null,
  }
}

export default defineEventHandler(async (event) => {
  // Read student id from route params
  const idParam = event.context.params?.id
  const id = Number(idParam)

  // Validate id
  if (!id || Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid student id.',
    })
  }

  // Fetch existing student record
  const { data: existing, error: fetchError } = await supabase
    .from('Student')
    .select('*')
    .eq('student_id', id)
    .single()

  // Ensure student exists
  if (fetchError || !existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Student not found.',
    })
  }

  // Expected request body shape
  type Body = {
    firstName?: string
    lastName?: string
    gradeLevel?: number | null
    program?: string | null

    organizationId?: number | null

    notes?: string | null

    isArchived?: boolean | null
  }

  // Read request body
  const body = await readBody<Body>(event)

  // Build update payload using existing values as fallback
  const updateData: Partial<Student> = {
    student_fname: body.firstName ?? existing.student_fname,
    student_lname: body.lastName ?? existing.student_lname,
    student_grade_level:
      body.gradeLevel !== undefined ? body.gradeLevel : existing.student_grade_level,
    student_program: body.program ?? existing.student_program,
    is_archived: body.isArchived ?? existing.is_archived,
  }

  // Handle organization update separately (allow null or number)
  if (body.organizationId !== undefined) {
    updateData.organization_id = body.organizationId === null ? null : Number(body.organizationId)
  }

  // Handle notes update separately (trim and normalize empty string to null)
  if (body.notes !== undefined) {
    const cleaned =
      body.notes === null ? null : String(body.notes).trim()
    updateData.student_notes = cleaned === '' ? null : cleaned
  }

  // Execute update query
  const { data: updated, error: updateError } = await supabase
    .from('Student')
    .update(updateData)
    .eq('student_id', id)
    .select()
    .single()

  // Handle update failure
  if (updateError || !updated) {
    console.error('Error updating student:', updateError)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update student',
    })
  }

  // Return updated student in frontend format
  return toFrontend(updated)
})