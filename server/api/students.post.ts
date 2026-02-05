
import { supabase } from '../supabase.js'
import { readBody, createError } from 'h3'

function toFrontend(s: any) {
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
  }

  const body = await readBody<Body>(event)

  // Require names
  if (!body.firstName || !body.lastName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'firstName and lastName are required.',
    })
  }

  // Require organizationId (Student.organization_id is required)
  if (body.organizationId === undefined || body.organizationId === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'organizationId is required.',
    })
  }

  // Determine teacher_id
  let teacherId: number

  if (body.teacherId !== undefined && body.teacherId !== null) {
    teacherId = Number(body.teacherId)
  } else {
    const { data: defaultTeacher, error } = await supabase
      .from('Teacher')
      .select('teacher_id')
      .limit(1)
      .single()

    if (error || !defaultTeacher) {
      throw createError({
        statusCode: 500,
        statusMessage:
          'No teacher available to assign to new students (teacher_id is required).',
      })
    }

    teacherId = Number(defaultTeacher.teacher_id)
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
      statusMessage: 'Failed to create student.',
    })
  }

  return toFrontend(created)
})
