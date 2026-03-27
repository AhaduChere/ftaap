// Centralized student state + CRUD helpers
import type { Student } from "../../types/student"

type CreateStudent = {
  firstName: string
  lastName: string
  gradeLevel: number | null
  program: string | null
  organizationId: number
  notes?: string | null
  isArchived: boolean | null
  teacherId?: number | null
}

type Success = {
  success: boolean
  message: string | null
  students: Student[]
}

type UpdateStudent = Partial<CreateStudent>

function friendlyError(e: any) {
  const msg = e?.data?.message ?? e?.data?.statusMessage ?? e?.message ?? 'Request failed.'
  if (typeof msg === 'string' && (msg.includes('<!DOCTYPE html>') || msg.includes('<html'))) {
    return 'Service temporarily unavailable. Please refresh and try again.'
  }
  return msg
}

export function useStudents() {
  const students = useState<Student[]>('students', () => [])
  const pending = useState<boolean>('students_pending', () => false)
  const error = useState<string | null>('students_error', () => null)

  const refresh = async (teacher_id: string) => {
    pending.value = true

    if (!teacher_id) {
      students.value = []
    } else {
      try {
        const data = await $fetch<Success>(`/api/studentsByTeacher/${teacher_id}`)
        if (data.success) {
          students.value = Array.isArray(data.students) ? data.students : []
        } else {
          error.value = 'Error getting students'
        }
        error.value = null
      } catch (e) {
        console.error('Failed to load students', e)
        error.value = friendlyError(e)
        students.value = students.value ?? []
      } finally {
        pending.value = false
      }
    }
  }

  const create = async (payload: CreateStudent, teacher_id: string) => {
    pending.value = true
    try {
      const { $supabase } = useNuxtApp()
      const { data: userData, error: userError } = await ($supabase as any).auth.getUser()

      if (userError || !userData?.user?.id) {
        throw new Error('Unable to determine the logged in user.')
      }

      await $fetch<Student>('/api/students/student', {
        method: 'POST',
        body: {
          ...payload,
          authId: userData.user.id,
        },
      })

      await refresh(teacher_id)
      error.value = null
    } catch (e) {
      console.error('Failed to create student', e)
      error.value = friendlyError(e)
      throw e
    } finally {
      pending.value = false
    }
  }

  const replace = async (id: number, payload: UpdateStudent, teacher_id: string) => {
    pending.value = true
    try {
      await $fetch<Student>(`/api/students/${id}`, {
        method: 'PUT',
        body: payload,
      })
      await refresh(teacher_id)
      error.value = null
    } catch (e) {
      console.error('Failed to update student', e)
      error.value = friendlyError(e)
      throw e
    } finally {
      pending.value = false
    }
  }

  const remove = async (id: number, teacher_id: string) => {
    pending.value = true
    try {
      await $fetch(`/api/students/${id}`, {
        method: 'DELETE',
      })
      await refresh(teacher_id)
      error.value = null
    } catch (e) {
      console.error('Failed to archive student', e)
      error.value = friendlyError(e)
      throw e
    } finally {
      pending.value = false
    }
  }

  const purge = async (id: number) => {
    pending.value = true
    try {
      await $fetch(`/api/students/${id}/purge`, {
        method: 'DELETE',
      })
      error.value = null
    } catch (e) {
      console.error('Failed to permanently delete student', e)
      error.value = friendlyError(e)
      throw e
    } finally {
      pending.value = false
    }
  }

  return { students, pending, error, refresh, create, replace, remove, purge }
}