// useArchivedStudents.ts
// Centralized archived student state management.
// This composable handles:
// - fetching archived students from the API
// - storing archived student data in global state
// - tracking loading and error states
// - exposing a refresh function to reload data


// Type definition for archived student objects used in the frontend
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

export function useArchivedStudents() {
  // Global state for archived students list
  const students = useState<ArchivedStudent[]>('archived_students', () => [])

  // Tracks whether data is currently being fetched
  const pending = useState<boolean>('archived_students_pending', () => false)

  // Stores any error message from fetch attempts
  const error = useState<string | null>('archived_students_error', () => null)

  // Fetch archived students from backend API
  const refresh = async () => {
    pending.value = true // set loading state
    try {
      // Request archived students
      const data = await $fetch<ArchivedStudent[]>('/api/students/archived')

      // Ensure response is an array before assigning
      students.value = Array.isArray(data) ? data : []

      // Clear previous errors on success
      error.value = null
    } catch (e:any) {
      // Log error for debugging
      console.error('Failed to load archived students', e)

      // Set user-friendly error message
      error.value = e?.data?.message ?? e?.message ?? 'Failed to load archived students.'

      // Reset students list on failure
      students.value = []
    } finally {
      // Always clear loading state
      pending.value = false
    }
  }

  // Expose state + refresh function to components
  return { students, pending, error, refresh }
}