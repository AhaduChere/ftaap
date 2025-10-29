// composables/useStudents.ts
export type Student = {
  id: number
  firstName: string
  lastName: string
  grade: string
  attendancePct: number
  teacher: string
  email: string
  dibelsScore: number  
  createdAt?: string
  updatedAt?: string
}

type CreateStudent = {
  firstName: string
  lastName: string
  grade: string
  attendancePct: number
  teacher: string
  email: string
  dibelsScore?: number  
}

type ReplaceStudent = {
  firstName: string
  lastName: string
  grade: string
  attendancePct: number
  teacher: string
  email: string
  dibelsScore: number   
}

export function useStudents() {
  const students = useState<Student[]>('students', () => [])
  const pending  = useState<boolean>('students_pending', () => false)
  const error    = useState<string | null>('students_error', () => null)

  const refresh = async (q = '') => {
    pending.value = true
    try {
      const data = await $fetch<Student[]>('/api/students', { query: q ? { q } : undefined })
      students.value = Array.isArray(data) ? data : []
      error.value = null
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to load students'
    } finally {
      pending.value = false
    }
  }

  const create = async (s: CreateStudent) => {
    await $fetch('/api/students', { method: 'POST', body: s })
    await refresh()
  }

  const replace = async (id: number, s: ReplaceStudent) => {
    await $fetch(`/api/students/${id}`, { method: 'PUT', body: s })
    await refresh()
  }

  const remove = async (id: number) => {
    await $fetch(`/api/students/${id}`, { method: 'DELETE' })
    await refresh()
  }

  return { students, pending, error, refresh, create, replace, remove }
}
