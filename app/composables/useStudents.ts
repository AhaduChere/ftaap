// useStudents.ts
// Centralized student state management for active students.
// This composable handles:
// - fetching students for the current teacher
// - creating students
// - updating students
// - archiving students
// - permanently deleting students
// - tracking loading and error state


// Centralized student state + CRUD helpers
import type { Student } from "../../types/student"

// Payload shape for creating a new student
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

// Expected success response shape when fetching students
type Success = {
  success: boolean
  message: string | null
  students: Student[]
}

// Update payload allows partial student fields
type UpdateStudent = Partial<CreateStudent>

// Converts raw errors into cleaner user-facing messages
function friendlyError(e: any) {
  const msg = e?.data?.message ?? e?.data?.statusMessage ?? e?.message ?? 'Request failed.'

  // Handle cases where backend returned an HTML error page instead of JSON
  if (typeof msg === 'string' && (msg.includes('<!DOCTYPE html>') || msg.includes('<html'))) {
    return 'Service temporarily unavailable. Please refresh and try again.'
  }

  return msg
}

export function useStudents() {
  // Shared state for active students
  const students = useState<Student[]>('students', () => [])

  // Tracks whether a student request is currently running
  const pending = useState<boolean>('students_pending', () => false)

  // Stores the latest student-related error message
  const error = useState<string | null>('students_error', () => null)

  // Fetch students for the current teacher
  const refresh = async (teacher_id: string) => {
    pending.value = true

    // If no teacher id is available, clear the list
    if (!teacher_id) {
      students.value = []
    } else {
      try {
        // Request teacher-scoped student data
        const data = await $fetch<Success>(`/api/studentsByTeacher/${teacher_id}`)

        // Save returned student array on success
        if (data.success) {
          students.value = Array.isArray(data.students) ? data.students : []
        } else {
          error.value = 'Error getting students'
        }

        // Clear any previous error after a successful request
        error.value = null
      } catch (e) {
        // Log error for debugging
        console.error('Failed to load students', e)

        // Save friendly error for UI
        error.value = friendlyError(e)

        // Preserve current student list if possible
        students.value = students.value ?? []
      } finally {
        // Always clear loading state
        pending.value = false
      }
    }
  }

  // Create a new student, then refresh the teacher's list
  const create = async (payload: CreateStudent, teacher_id: string) => {
    pending.value = true
    try {
      // Get current logged-in user so backend can resolve teacher ownership
      const { $supabase } = useNuxtApp()
      const { data: userData, error: userError } = await ($supabase as any).auth.getUser()

      // Stop if user session cannot be determined
      if (userError || !userData?.user?.id) {
        throw new Error('Unable to determine the logged in user.')
      }

      // Send create request to backend
      await $fetch<Student>('/api/students/student', {
        method: 'POST',
        body: {
          ...payload,
          authId: userData.user.id,
        },
      })

      // Refresh student list after creation
      await refresh(teacher_id)
      error.value = null
    } catch (e) {
      // Log error for debugging
      console.error('Failed to create student', e)

      // Save friendly error for UI
      error.value = friendlyError(e)

      // Re-throw so calling code can handle modal/page-specific errors
      throw e
    } finally {
      // Always clear loading state
      pending.value = false
    }
  }

  // Replace an existing student record, then refresh the list
  const replace = async (id: number, payload: UpdateStudent, teacher_id: string) => {
    pending.value = true
    try {
      // Send update request
      await $fetch<Student>(`/api/students/${id}`, {
        method: 'PUT',
        body: payload,
      })

      // Refresh student list after update
      await refresh(teacher_id)
      error.value = null
    } catch (e) {
      // Log error for debugging
      console.error('Failed to update student', e)

      // Save friendly error for UI
      error.value = friendlyError(e)

      // Re-throw so calling code can handle modal/page-specific errors
      throw e
    } finally {
      // Always clear loading state
      pending.value = false
    }
  }

  // Archive a student, then refresh the list
  const remove = async (id: number, teacher_id: string) => {
    pending.value = true
    try {
      // Send archive/delete request
      await $fetch(`/api/students/${id}`, {
        method: 'DELETE',
      })

      // Refresh student list after archiving
      await refresh(teacher_id)
      error.value = null
    } catch (e) {
      // Log error for debugging
      console.error('Failed to archive student', e)

      // Save friendly error for UI
      error.value = friendlyError(e)

      // Re-throw so calling code can handle confirmation/action errors
      throw e
    } finally {
      // Always clear loading state
      pending.value = false
    }
  }

  // Permanently delete a student record
  const purge = async (id: number) => {
    pending.value = true
    try {
      // Send permanent delete request
      await $fetch(`/api/students/${id}/purge`, {
        method: 'DELETE',
      })

      error.value = null
    } catch (e) {
      // Log error for debugging
      console.error('Failed to permanently delete student', e)

      // Save friendly error for UI
      error.value = friendlyError(e)

      // Re-throw so calling code can handle confirmation/action errors
      throw e
    } finally {
      // Always clear loading state
      pending.value = false
    }
  }

  // Expose shared student state and CRUD actions
  return { students, pending, error, refresh, create, replace, remove, purge }
}
