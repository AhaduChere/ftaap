// composables/useStudents.ts
// Centralized student state + CRUD helpers backed by Supabase via Prisma

export type Student = {
  id: number
  firstName: string
  lastName: string
  gradeLevel: number | null
  program: string | null
  teacherId: number | null
  studentScoreId: number | null
  studentAttendanceId: number | null
  isArchived: boolean | null
}

type CreateStudent = {
  firstName: string
  lastName: string
  gradeLevel: number | null
  program: string | null
  isArchived: boolean | null
}

type UpdateStudent = Partial<CreateStudent>

export function useStudents() {
  const students = useState<Student[]>('students', () => [])
  const pending = useState<boolean>('students_pending', () => false)
  const error = useState<string | null>('students_error', () => null)

  const refresh = async () => {
    pending.value = true
    try {
      const data = await $fetch<Student[]>('/api/students')
      students.value = Array.isArray(data) ? data : []
      error.value = null
    } catch (e: any) {
      console.error('Failed to load students', e)
      error.value =
        e?.data?.message ??
        e?.message ??
        'Failed to load students.'
    } finally {
      pending.value = false
    }
  }

  const create = async (payload: CreateStudent) => {
    pending.value = true
    try {
      await $fetch<Student>('/api/students', {
        method: 'POST',
        body: payload,
      })
      await refresh()
      error.value = null
    } catch (e: any) {
      console.error('Failed to create student', e)
      error.value =
        e?.data?.message ??
        e?.message ??
        'Failed to create student.'
      throw e
    } finally {
      pending.value = false
    }
  }

  const replace = async (id: number, payload: UpdateStudent) => {
    pending.value = true
    try {
      await $fetch<Student>(`/api/students/${id}`, {
        method: 'PUT',
        body: payload,
      })
      await refresh()
      error.value = null
    } catch (e: any) {
      console.error('Failed to update student', e)
      error.value =
        e?.data?.message ??
        e?.message ??
        'Failed to update student.'
      throw e
    } finally {
      pending.value = false
    }
  }

  const remove = async (id: number) => {
    pending.value = true
    try {
      await $fetch(`/api/students/${id}`, {
        method: 'DELETE',
      })
      await refresh()
      error.value = null
    } catch (e: any) {
      console.error('Failed to delete student', e)
      error.value =
        e?.data?.message ??
        e?.message ??
        'Failed to delete student.'
      throw e
    } finally {
      pending.value = false
    }
  }

  return { students, pending, error, refresh, create, replace, remove }
}
