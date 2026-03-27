import { supabase } from '../../supabase.js'
import { readBody, createError, defineEventHandler } from 'h3'
import type { Student } from '../../../types/student'

function toFrontend(s: Student) {
  return {
    id: Number(s.student_id),
    firstName: s.student_fname ?? '',
    lastName: s.student_lname ?? '',
    gradeLevel:
      s.student_grade_level !== null && s.student_grade_level !== undefined
        ? Number(s.student_grade_level)
        : null,
    program: s.student_program ?? null,
    organizationId:
      s.organization_id !== null && s.organization_id !== undefined
        ? Number(s.organization_id)
        : null,
    notes: s.student_notes ?? null,
    isArchived: s.is_archived ?? false,
    teacherId:
      s.teacher_id !== null && s.teacher_id !== undefined
        ? Number(s.teacher_id)
        : null,
  }
}

export default defineEventHandler(async (event) => {
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

  const body = await readBody<Body>(event)

  if (!body.firstName || !body.lastName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'firstName and lastName are required.',
    })
  }

  if (body.organizationId === undefined || body.organizationId === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'organizationId is required.',
    })
  }

  if (!body.authId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in to create a student.',
    })
  }

  const { data: currentUser, error: currentUserError } = await supabase
    .from('User')
    .select('*')
    .eq('auth_id', body.authId)
    .single()

  if (currentUserError || !currentUser) {
    console.error('Error fetching current user:', currentUserError)
    throw createError({
      statusCode: 403,
      statusMessage: 'Unable to determine the current user role.',
    })
  }

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

  if (insertError || !created) {
    console.error('Error creating student:', insertError)
    throw createError({
      statusCode: 500,
      statusMessage: insertError?.message || 'Failed to create student.',
    })
  }

  return toFrontend(created)
})