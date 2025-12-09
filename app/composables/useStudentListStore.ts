// app/composables/useStudentListStore.ts
import { ref, computed, watch } from 'vue'
import { useStudents } from '~/composables/useStudents'

// Keep the same sort mode strings so existing UI still works
export type SortMode = 'A - Z' | 'By color'

/**
 * SHARED STATE (safe at module scope)
 * These do NOT use Nuxt composables, so they are safe to define here.
 */

// This is the shared reactive list used by the dashboard
const studentsRef = ref<any[]>([])

// Old-style imports like `import { students } ...` will now work again ✅
export const students = studentsRef

// Dashboard UI state (search + sort)
export const searchQuery = ref<string>('')
export const sortMode = ref<SortMode>('A - Z')

// Filter + sort against the new DB fields
export const filteredStudents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()

  let baseList = studentsRef.value.filter((s: any) => {
    const fullName = `${s.lastName}, ${s.firstName}`.toLowerCase()
    const program = (s.program || '').toLowerCase()
    const gradeStr =
      s.gradeLevel !== null && s.gradeLevel !== undefined
        ? String(s.gradeLevel)
        : ''

    const matchesQ =
      !q ||
      fullName.includes(q) ||
      program.includes(q) ||
      gradeStr.toLowerCase().includes(q)

    return matchesQ
  })

  if (sortMode.value === 'A - Z') {
    baseList = [...baseList].sort((a: any, b: any) =>
      `${a.lastName}${a.firstName}`.localeCompare(
        `${b.lastName}${b.firstName}`,
        undefined,
        { sensitivity: 'base' },
      ),
    )
  } else if (sortMode.value === 'By color') {
    // Reuse "By color" as "by gradeLevel, then name"
    baseList = [...baseList].sort((a: any, b: any) => {
      const ag =
        a.gradeLevel !== null && a.gradeLevel !== undefined
          ? a.gradeLevel
          : Number.POSITIVE_INFINITY
      const bg =
        b.gradeLevel !== null && b.gradeLevel !== undefined
          ? b.gradeLevel
          : Number.POSITIVE_INFINITY

      if (ag !== bg) return ag - bg

      return `${a.lastName}${a.firstName}`.localeCompare(
        `${b.lastName}${b.firstName}`,
        undefined,
        { sensitivity: 'base' },
      )
    })
  }

  return baseList
})

/**
 * COMPOSABLE API
 * This is what you should use in new code:
 *
 *   const { students, searchQuery, sortMode, filteredStudents } = useStudentListStore()
 */
export function useStudentListStore() {
  // ✅ SAFE: called inside a composable, so we can use Nuxt composables here
  const { students } = useStudents()

  // Sync the `useStudents().students` array into the shared `studentsRef`
  watch(
    students,
    (val) => {
      studentsRef.value = val ?? []
    },
    { immediate: true },
  )

  return {
    students: studentsRef,
    searchQuery,
    sortMode,
    filteredStudents,
  }
}
