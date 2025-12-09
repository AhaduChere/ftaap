// app/composables/useArchivedStudents.ts

export type ArchivedStudent = {
  id: number
  firstName: string
  lastName: string
  gradeLevel: number | null
  program: string | null
  isArchived: boolean
}

export function useArchivedStudents() {
  const students = useState<ArchivedStudent[]>('archived_students', () => [])
  const pending = useState<boolean>('archived_students_pending', () => false)
  const error = useState<string | null>('archived_students_error', () => null)

  const refresh = async () => {
    pending.value = true
    try {
      const data = await $fetch<ArchivedStudent[]>('/api/students/archived')
      students.value = Array.isArray(data) ? data : []
      error.value = null
    } catch (e: any) {
      console.error('Failed to load archived students', e)
      error.value =
        e?.data?.message ?? e?.message ?? 'Failed to load archived students.'
    } finally {
      pending.value = false
    }
  }

  return { students, pending, error, refresh }
}
