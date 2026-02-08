import { supabase } from '../../supabase.js'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async () => {
  const { data: studentRows, error: studentsError } = await supabase
    .from('Student')
    .select(
      `
      student_id,
      student_fname,
      student_lname,
      student_grade_level,
      student_program,
      organization_id,
      student_notes,
      is_archived
    `,
    )
    // IMPORTANT: Manage Students page should only show NON-archived students
    .eq('is_archived', false)
    .order('student_lname', { ascending: true })
    .order('student_fname', { ascending: true })

  if (studentsError) {
    console.error('Error fetching students:', studentsError)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load students.',
    })
  }

  const students = Array.isArray(studentRows) ? studentRows : []

  const { data: orgRows, error: orgError } = await supabase
    .from('Organization')
    .select('id, organization_name')

  if (orgError) {
    console.error('Error fetching organizations:', orgError)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load organizations.',
    })
  }

  const orgMap = new Map<number, string>()
  for (const o of orgRows ?? []) {
    orgMap.set(Number((o as Organization).id), (o as Organization).organization_name ?? '')
  }

  return students.map((s: Student) => {
    const orgId =
      s.organization_id !== null && s.organization_id !== undefined
        ? Number(s.organization_id)
        : null

    return {


      id: Number(s.student_id),
      firstName: s.student_fname ?? '',
      lastName: s.student_lname ?? '',
      gradeLevel:
        s.student_grade_level !== null && s.student_grade_level !== undefined
          ? Number(s.student_grade_level)
          : null,
      program: s.student_program ?? null,

      organizationId: orgId,
      organization: orgId !== null ? orgMap.get(orgId) ?? null : null,

      notes: s.student_notes ?? null,
      isArchived: s.is_archived ?? false,
    }
  })
})
