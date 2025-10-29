// composables/useStudentListStore.ts
import { ref, computed } from 'vue'

/** UI tier labels */
export type Performance = 'All' | 'Core' | 'Strategic' | 'Intensive'
export type SortMode = 'A - Z' | 'By color'

/** Card list shape used by dashboard widgets */
export interface Student {
  id: number
  name: string        // "Last, First"
  score: number       // DIBELS score
}

/** Backend API shape returned by /api/students */
interface StudentApi {
  id: number
  firstName: string
  lastName: string
  grade: string
  attendancePct: number
  teacher: string
  email: string
  dibelsScore: number
}

/* ----------------- Reactive state ----------------- */
export const students = ref<Student[]>([])
export const searchQuery = ref<string>('')
export const tierFilter  = ref<Performance>('All')
export const sortMode    = ref<SortMode>('By color')

let inFlight: Promise<void> | null = null

/**
 * Refresh from /api/students and map to UI shape.
 * - name = "Last, First"
 * - score = dibelsScore
 */
export async function refreshStudentList(q?: string): Promise<void> {
  if (typeof q === 'string') searchQuery.value = q
  if (inFlight) return inFlight

  inFlight = (async () => {
    try {
      const query = searchQuery.value ? { q: searchQuery.value } : undefined
      const data = await $fetch<StudentApi[]>('/api/students', { query })
      students.value = (data ?? []).map((s) => ({
        id: s.id,
        name: `${s.lastName}, ${s.firstName}`,
        score: Number.isFinite(s.dibelsScore) ? Number(s.dibelsScore) : 0,
      }))
    } catch (err) {
      console.error('Failed to fetch students:', err)
      students.value = []
    } finally {
      inFlight = null
    }
  })()

  return inFlight
}

/** Reset global filters */
export function resetStudentFilters() {
  searchQuery.value = ''
  tierFilter.value  = 'All'
  sortMode.value    = 'By color'
}

/* ----------------- DIBELS tier logic -----------------
   Core       : score >= 420  (green)
   Strategic  : 406–419       (yellow)
   Intensive  : < 406         (red)
------------------------------------------------------ */
export function scoreToPerformance(score: number): Exclude<Performance, 'All'> {
  if (score >= 420) return 'Core'
  if (score >= 406) return 'Strategic'
  return 'Intensive'
}

export function performanceRankByColor(score: number): number {
  const tier = scoreToPerformance(score)
  return tier === 'Intensive' ? 0 : tier === 'Strategic' ? 1 : 2
}

/** Styling helpers used by cards */
export function scoreBorderClass() {
  return 'border-[#2e777e]'
}

export function flagFillClass(score: number) {
  const tier = scoreToPerformance(score)
  if (tier === 'Core')       return 'fill-green-500'
  if (tier === 'Strategic')  return 'fill-yellow-400'
  return 'fill-red-500'
}

/** Filtered + sorted view for StudentListCard */
export const filteredStudents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()

  const base = students.value.filter((s) => {
    const matchesName = !q || s.name.toLowerCase().includes(q)
    const matchesTier =
      tierFilter.value === 'All' || scoreToPerformance(s.score) === tierFilter.value
    return matchesName && matchesTier
  })

  if (sortMode.value === 'A - Z') {
    return [...base].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    )
  }

  if (sortMode.value === 'By color') {
    return [...base].sort((a, b) => {
      const diff = performanceRankByColor(a.score) - performanceRankByColor(b.score)
      return diff !== 0
        ? diff
        : a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    })
  }

  return base
})

/* --------- Client-side bootstrap (so list shows) ---------
   If nothing has loaded yet on the client, fetch once automatically.
---------------------------------------------------------- */
if (import.meta.client) {
  queueMicrotask(() => {
    if (students.value.length === 0 && !inFlight) {
      refreshStudentList().catch((e) => console.error(e))
    }
  })
}
