// student.post.ts
// API handler for creating a new student.
// This endpoint handles:
// - reading and validating the request body
// - verifying the current logged-in user
// - determining the correct teacher_id for the new student
// - inserting the student into the database
// - transforming the created row into a frontend-friendly object


import { supabase } from '../../supabase.js'
import { readBody, createError, defineEventHandler } from 'h3'
import type { Student } from '../../../types/student'

// Converts a database student row into a frontend-friendly format
function toFrontend(s: Student) {
  return {
    id: Number(s.student_id), // normalize id to number
    firstName: s.student_fname ?? '', // fallback to empty string
    lastName: s.student_lname ?? '', // fallback to empty string
    gradeLevel:
      s.student_grade_level !== null && s.student_grade_level !== undefined
        ? Number(s.student_grade_level)
        : null, // normalize grade level or set null
    program: s.student_program ?? null, // allow null if missing
    organizationId:
      s.organization_id !== null && s.organization_id !== undefined
        ? Number(s.organization_id)
        : null, // normalize organization id or set null
    notes: s.student_notes ?? null, // allow null if missing
    isArchived: s.is_archived ?? false, // default to false if undefined
    teacherId:
      s.teacher_id !== null && s.teacher_id !== undefined
        ? Number(s.teacher_id)
        : null, // normalize teacher id or set null
  }
}

export default defineEventHandler(async (event) => {
  // Expected request body shape for creating a student
  type Body = {
    firstName?: string
    lastName?: string
    gradeLevel?: number | null
    program?: string | null
    organizationId?: number | null
    notes?: string | null
    isArchived?: boolean | null
    teacherId?: number | null
    authId?: string | null
  }

  // Read request body
  const body = await readBody<Body>(event)

  // Validate required student name fields
  if (!body.firstName || !body.lastName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'firstName and lastName are required.',
    })
  }

  // Validate required organization id
  if (body.organizationId === undefined || body.organizationId === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'organizationId is required.',
    })
  }

  // Validate that the request is tied to a logged-in user
  if (!body.authId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in to create a student.',
    })
  }

  // Look up the current user in the database using auth_id
  const { data: currentUser, error: currentUserError } = await supabase
    .from('User')
    .select('*')
    .eq('auth_id', body.authId)
    .single()

  // Stop if current user cannot be found/resolved
  if (currentUserError || !currentUser) {
    console.error('Error fetching current user:', currentUserError)
    throw createError({
      statusCode: 403,
      statusMessage: 'Unable to determine the current user role.',
    })
  }

  // Teacher id that will be assigned to the new student
  let teacherId: number | null = null

  // Teacher creating student: always use their own teacher_id
  if (currentUser.teacher_id !== null && currentUser.teacher_id !== undefined) {
    teacherId = Number(currentUser.teacher_id)
  }
  // Admin creating student: use selected teacher if provided, otherwise null
  else if (currentUser.admin_id !== null && currentUser.admin_id !== undefined) {
    teacherId =
      body.teacherId !== undefined && body.teacherId !== null
        ? Number(body.teacherId)
        : null
  }
  // fallback
  else {
    teacherId =
      body.teacherId !== undefined && body.teacherId !== null
        ? Number(body.teacherId)
        : null
  }

  // Insert new student row into the database
  const { data: created, error: insertError } = await supabase
    .from('Student')
    .insert({
      teacher_id: teacherId,
      student_fname: body.firstName,
      student_lname: body.lastName,
      student_grade_level:
        body.gradeLevel !== undefined && body.gradeLevel !== null
          ? Number(body.gradeLevel)
          : null,
      student_program: body.program ?? null,
      organization_id: Number(body.organizationId),
      student_notes: body.notes ?? null,
      is_archived: body.isArchived ?? false,
    })
    .select()
    .single()

  // Handle database insert failure
  if (insertError || !created) {
    console.error('Error creating student:', insertError)
    throw createError({
      statusCode: 500,
      statusMessage: insertError?.message || 'Failed to create student.',
    })
  }

  // Return created student in frontend-friendly format
  return toFrontend(created)
})