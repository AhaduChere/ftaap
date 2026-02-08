
// Centralized student state + CRUD helpers

export type Student = {
  id: number
  firstName: string
  lastName: string
  gradeLevel: number | null
  program: string | null
  organizationId: number | null
  organization: string | null
  notes: string | null
  isArchived: boolean | null
}

type CreateStudent = {
  firstName: string
  lastName: string
  gradeLevel: number | null
  program: string | null
  organizationId: number
  notes?: string | null
  isArchived: boolean | null
}

type UpdateStudent = Partial<CreateStudent>

function friendlyError(e: error) {
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

  const refresh = async () => {
    pending.value = true
    try {
      const data = await $fetch<Student[]>('/api/students/students')
      students.value = Array.isArray(data) ? data : []
      error.value = null
    } catch (e: error) {
      console.error('Failed to load students', e)
      error.value = friendlyError(e)
      students.value = students.value ?? []
    } finally {
      pending.value = false
    }
  }

  const create = async (payload: CreateStudent) => {
    pending.value = true
    try {
      await $fetch<Student>('/api/students/student', {
        method: 'POST',
        body: payload,
      })
      await refresh()
      error.value = null
    } catch (e: error) {
      console.error('Failed to create student', e)
      error.value = friendlyError(e)
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
    } catch (e: error) {
      console.error('Failed to update student', e)
      error.value = friendlyError(e)
      throw e
    } finally {
      pending.value = false
    }
  }

  // Existing: archive (soft delete)
  const remove = async (id: number) => {
    pending.value = true
    try {
      await $fetch(`/api/students/${id}`, {
        method: 'DELETE',
      })
      await refresh()
      error.value = null
    } catch (e: error) {
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
      // NOTE: do not call refresh() here automatically because this composable’s refresh()
      // loads active (non-archived) students. The archived page should refresh its own list.
      error.value = null
    } catch (e: error) {
      console.error('Failed to permanently delete student', e)
      error.value = friendlyError(e)
      throw e
    } finally {
      pending.value = false
    }
  }

  return { students, pending, error, refresh, create, replace, remove, purge }
}
