// useArchivedStudents.ts
// Centralized archived student state management.
// This composable handles:
// - fetching archived students for the current teacher
// - storing archived student data in global state
// - tracking loading and error states
// - exposing a refresh function to reload data

export type ArchivedStudent = {
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

type Success = {
  success: boolean
  message: string | null
  students: ArchivedStudent[]
}

function friendlyError(e: any) {
  const msg = e?.data?.message ?? e?.data?.statusMessage ?? e?.message ?? 'Request failed.'

  if (typeof msg === 'string' && (msg.includes('<!DOCTYPE html>') || msg.includes('<html'))) {
    return 'Service temporarily unavailable. Please refresh and try again.'
  }

  return msg
}

export function useArchivedStudents() {
  const students = useState<ArchivedStudent[]>('archived_students', () => [])
  const pending = useState<boolean>('archived_students_pending', () => false)
  const error = useState<string | null>('archived_students_error', () => null)

  const refresh = async (teacher_id: string) => {
    pending.value = true

    if (!teacher_id) {
      students.value = []
      pending.value = false
      return
    }

    try {
      const data = await $fetch<Success>(`/api/students/archived?authId=${teacher_id}`)

      if (data.success) {
        students.value = Array.isArray(data.students) ? data.students : []
        error.value = null
      } else {
        students.value = []
        error.value = data.message ?? 'Failed to load archived students.'
      }
    } catch (e: any) {
      console.error('Failed to load archived students', e)
      error.value = friendlyError(e)
      students.value = []
    } finally {
      pending.value = false
    }
  }

  return { students, pending, error, refresh }
}