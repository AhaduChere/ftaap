<script setup lang="ts">
import { ref, computed, onMounted, onServerPrefetch } from 'vue'
import { useArchivedStudents } from '~/composables/useArchivedStudents'
import { useStudents } from '~/composables/useStudents'

type ArchivedStudentRow = {
  id: number
  firstName: string
  lastName: string
  gradeLevel: number | null
  program: string | null
  organization?: string | null 
  isArchived: boolean | null
}

const { students, pending, error, refresh } = useArchivedStudents()
const { purge } = useStudents()

onServerPrefetch(() => refresh())
onMounted(() => refresh())

const search = ref('')
const programFilter = ref('All')
const gradeFilter = ref('All')

const programs = computed(() => {
  const set = new Set<string>()
  ;(students.value as ArchivedStudentRow[]).forEach((s) => {
    const p = (s.program || '').trim()
    if (p) set.add(p)
  })
  return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
})

const grades = computed(() => {
  const set = new Set<string>()
  ;(students.value as ArchivedStudentRow[]).forEach((s) => {
    if (s.gradeLevel !== null && s.gradeLevel !== undefined) {
      set.add(String(s.gradeLevel))
    }
  })
  return ['All', ...Array.from(set).sort((a, b) => Number(a) - Number(b))]
})

const visibleStudents = computed<ArchivedStudentRow[]>(() => {
  const q = search.value.trim().toLowerCase()

  return (students.value as ArchivedStudentRow[]).filter((s) => {
    const fullName = `${s.lastName}, ${s.firstName}`.toLowerCase()
    const program = (s.program || '').toLowerCase()
    const organization = (s.organization ?? '').toLowerCase() 
    const gradeStr =
      s.gradeLevel !== null && s.gradeLevel !== undefined ? String(s.gradeLevel) : ''

    const matchesQ =
      !q ||
      fullName.includes(q) ||
      program.includes(q) ||
      organization.includes(q) ||
      gradeStr.toLowerCase().includes(q)

    const matchesProgram =
      programFilter.value === 'All' || (s.program || '').trim() === programFilter.value

    const matchesGrade =
      gradeFilter.value === 'All' ||
      (s.gradeLevel !== null &&
        s.gradeLevel !== undefined &&
        String(s.gradeLevel) === gradeFilter.value)

    return matchesQ && matchesProgram && matchesGrade
  })
})

/* ---------------------------------------------------------
   Restore (unarchive)
--------------------------------------------------------- */
const unarchiveLoadingId = ref<number | null>(null)

async function unarchiveStudent(s: { id: number; firstName: string; lastName: string }) {
  if (!confirm(`Restore ${s.firstName} ${s.lastName} to the active student list?`)) return

  unarchiveLoadingId.value = s.id
  try {
    await $fetch(`/api/students/${s.id}/unarchive`, { method: 'POST' })
    await refresh()
  } catch (e) {
    console.error('Failed to unarchive student', e)
    alert('Failed to restore this student. Please try again.')
  } finally {
    unarchiveLoadingId.value = null
  }
}

/* ---------------------------------------------------------
   Permanent delete (purge)
--------------------------------------------------------- */
const deleteLoadingId = ref<number | null>(null)

async function permanentlyDeleteStudent(s: { id: number; firstName: string; lastName: string }) {
  const ok = confirm(
    `Permanently delete ${s.firstName} ${s.lastName}?\n\nThis cannot be undone.`,
  )
  if (!ok) return

  deleteLoadingId.value = s.id
  try {
    await purge(s.id)
    await refresh()
  } catch (e: any) {
    console.error('Failed to permanently delete student', e)
    alert(e?.data?.message ?? e?.message ?? 'Failed to permanently delete this student.')
  } finally {
    deleteLoadingId.value = null
  }
}
</script>

<template>
  <!-- Spacer so content clears the fixed header -->
  <div class="h-24 md:h-16"></div>

  <!-- Match manage-students background + padding -->
  <div class="p-6 space-y-6 bg-[#f7feff] min-h-screen">
    <div class="w-full bg-white border border-[#2e777e] drop-shadow-lg rounded-md overflow-visible">
      <!-- Teal header bar -->
      <header
        class="bg-[#2e777e] text-white px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
      >
        <div>
          <h1 class="text-lg md:text-xl font-semibold tracking-tight">
            Archived Students
          </h1>
          <p class="text-xs md:text-sm text-white/80">
            View previously archived students, restore them, or permanently delete them.
          </p>
        </div>
      </header>

      <!-- Filters row -->
      <section
        class="px-4 py-3 md:px-6 md:py-4 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center gap-3"
      >
        <input
          v-model="search"
          type="text"
          placeholder="Search by name, program, organization, or grade…"
          class="w-full md:flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
        />

        <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <select
            v-model="programFilter"
            class="w-full sm:w-40 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
          >
            <option v-for="p in programs" :key="p" :value="p">
              {{ p === 'All' ? 'All Programs' : p }}
            </option>
          </select>

          <select
            v-model="gradeFilter"
            class="w-full sm:w-40 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
          >
            <option v-for="g in grades" :key="g" :value="g">
              {{ g === 'All' ? 'All Grades' : `Grade ${g}` }}
            </option>
          </select>
        </div>
      </section>

      <!-- Table body -->
      <div class="p-4 md:p-6 bg-white">
        <div v-if="pending" class="flex items-center justify-center py-10 text-sm text-slate-500">
          Loading archived students…
        </div>

        <div
          v-else-if="error"
          class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ error }}
        </div>

        <div v-else>
          <table class="min-w-full text-sm border-collapse">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50">
                <th class="text-left py-2 px-2 md:px-3 font-semibold text-slate-700">Name</th>
                <th class="text-left py-2 px-2 md:px-3 font-semibold text-slate-700">Grade</th>
                <th class="text-left py-2 px-2 md:px-3 font-semibold text-slate-700">Program</th>
                <th class="text-left py-2 px-2 md:px-3 font-semibold text-slate-700">
                  Organization
                </th>
                <th class="text-right py-2 px-2 md:px-3 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="s in visibleStudents"
                :key="s.id"
                class="border-b border-slate-100 hover:bg-slate-50/60 transition"
              >
                <td class="py-2 px-2 md:px-3 text-slate-900">
                  {{ s.lastName }}, {{ s.firstName }}
                </td>

                <td class="py-2 px-2 md:px-3 text-slate-700">
                  <span v-if="s.gradeLevel !== null && s.gradeLevel !== undefined">
                    Grade {{ s.gradeLevel }}
                  </span>
                  <span v-else class="text-slate-400 text-xs italic">Not set</span>
                </td>

                <td class="py-2 px-2 md:px-3 text-slate-700">
                  <span v-if="(s.program ?? '').trim()">
                    {{ s.program }}
                  </span>
                  <span v-else class="text-slate-400 text-xs italic">No program</span>
                </td>

                <!--  FIXED: safe organization access -->
                <td class="py-2 px-2 md:px-3 text-slate-700">
                  <span v-if="(s.organization ?? '').trim()">
                    {{ s.organization }}
                  </span>
                 <span v-else class="text-slate-700">None</span>

                </td>

                <td class="py-2 px-2 md:px-3 text-right">
                  <div class="inline-flex items-center gap-2">
                    <!-- Restore -->
                    <button
                      type="button"
                      class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border border-emerald-500 text-emerald-700 hover:bg-emerald-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
                      :disabled="unarchiveLoadingId === s.id || deleteLoadingId === s.id"
                      @click="unarchiveStudent(s)"
                    >
                      <span v-if="unarchiveLoadingId === s.id">Restoring…</span>
                      <span v-else>Restore</span>
                    </button>

                    <!-- Permanent Delete -->
                    <button
                      type="button"
                      class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border border-red-500 text-red-700 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
                      :disabled="deleteLoadingId === s.id || unarchiveLoadingId === s.id"
                      @click="permanentlyDeleteStudent(s)"
                    >
                      <span v-if="deleteLoadingId === s.id">Deleting…</span>
                      <span v-else>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="visibleStudents.length === 0" class="border-t border-slate-100">
                <td colspan="5" class="py-6 px-2 md:px-3 text-center text-xs text-slate-500 italic">
                  No archived students match your current filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
