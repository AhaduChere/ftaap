// archived.get.ts
// API handler for retrieving archived students.
// This endpoint handles:
// - querying archived students from the database
// - filtering archived students by the logged-in teacher
// - returning all archived students for admins
// - sorting students by last name and first name
// - transforming database rows into frontend-friendly objects

import { supabase } from '../../supabase.js'
import { defineEventHandler, getQuery } from 'h3'
import type { Student } from '../../../types/student.js'

function toFrontend(s: Student, organization: string | null = null) {
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
    organization,
    notes: s.student_notes ?? null,
    isArchived: s.is_archived ?? false,
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const authId = String(query.authId ?? '')

  if (!authId) {
    return { success: false, message: 'Missing authId.', students: [] }
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('*')
      .eq('auth_id', authId)
      .single()

    if (userError || !userData) {
      return { success: false, message: 'Error fetching user data.', students: [] }
    }

    let rows: Student[] = []

    if (userData.teacher_id !== null && userData.teacher_id !== undefined) {
      const { data: teacherData, error: teacherError } = await supabase
        .from('Teacher')
        .select('*')
        .eq('user_id', userData.user_id)
        .single()

      if (teacherError || !teacherData) {
        return { success: false, message: 'Error fetching teacher data.', students: [] }
      }

      const { data, error } = await supabase
        .from('Student')
        .select('*')
        .eq('teacher_id', teacherData.teacher_id)
        .eq('is_archived', true)
        .order('student_lname', { ascending: true })
        .order('student_fname', { ascending: true })

      if (error) {
        return { success: false, message: 'Error fetching archived students.', students: [] }
      }

      rows = data ?? []
    } else if (userData.admin_id !== null && userData.admin_id !== undefined) {
      const { data, error } = await supabase
        .from('Student')
        .select('*')
        .eq('is_archived', true)
        .order('student_lname', { ascending: true })
        .order('student_fname', { ascending: true })

      if (error) {
        return { success: false, message: 'Error fetching archived students.', students: [] }
      }

      rows = data ?? []
    } else {
      return { success: false, message: 'User is not authorized.', students: [] }
    }

    const { data: orgRows, error: orgError } = await supabase
      .from('Organization')
      .select('id, organization_name')

    if (orgError) {
      return { success: false, message: 'Failed to load organizations.', students: [] }
    }

    const orgMap = new Map<number, string>()
    for (const o of orgRows ?? []) {
      orgMap.set(Number(o.id), o.organization_name ?? '')
    }

    const students = rows.map((s) => {
      const orgId =
        s.organization_id !== null && s.organization_id !== undefined
          ? Number(s.organization_id)
          : null

      return toFrontend(s, orgId !== null ? orgMap.get(orgId) ?? null : null)
    })

    return { success: true, message: null, students }
  } catch (error) {
    console.error('Error fetching archived students:', error)
    return { success: false, message: 'Server error.', students: [] }
  }
})