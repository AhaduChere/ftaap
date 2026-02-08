import { supabase } from '../../supabase.js'
import { readBody, createError, defineEventHandler } from 'h3'

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
  const idParam = event.context.params?.id
  const id = Number(idParam)

  if (!id || Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid student id.',
    })
  }

  const { data: existing, error: fetchError } = await supabase
    .from('Student')
    .select('*')
    .eq('student_id', id)
    .single()

  if (fetchError || !existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Student not found.',
    })
  }

  type Body = {
    firstName?: string
    lastName?: string
    gradeLevel?: number | null
    program?: string | null

  
    organizationId?: number | null

  
    notes?: string | null

    isArchived?: boolean | null
  }

  const body = await readBody<Body>(event)

  const updateData: Student = {
    student_fname: body.firstName ?? existing.student_fname,
    student_lname: body.lastName ?? existing.student_lname,
    student_grade_level:
      body.gradeLevel !== undefined ? body.gradeLevel : existing.student_grade_level,
    student_program: body.program ?? existing.student_program,
    is_archived: body.isArchived ?? existing.is_archived,
  }

 
  if (body.organizationId !== undefined) {
    updateData.organization_id = body.organizationId === null ? null : Number(body.organizationId)
  }

 
  if (body.notes !== undefined) {
    const cleaned =
      body.notes === null ? null : String(body.notes).trim()
    updateData.student_notes = cleaned === '' ? null : cleaned
  }

  const { data: updated, error: updateError } = await supabase
    .from('Student')
    .update(updateData)
    .eq('student_id', id)
    .select()
    .single()

  if (updateError || !updated) {
    console.error('Error updating student:', updateError)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update student',
    })
  }

  return toFrontend(updated)
})
