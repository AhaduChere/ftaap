<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  onServerPrefetch,
  onActivated,
} from 'vue'

import { useStudents } from '~/composables/useStudents'

// Child components
import StudentsHeader from '~/components/students/StudentsHeader.vue'
import StudentsControls from '~/components/students/StudentsControls.vue'

import StudentCreateModal from '@/components/students/StudentCreateModal.vue'
import StudentEditModal from '@/components/students/StudentEditModal.vue'
import StudentsTable from '@/components/students/StudentsTable.vue'



// Composable: API + state (Supabase via Prisma)
const { students, pending, error, refresh, create, replace, remove } = useStudents()

/* ---------------------------------------------------------
   Lifecycle
   --------------------------------------------------------- */

onServerPrefetch(() => refresh())
onMounted(() => refresh())
onActivated(() => refresh())

/* ---------------------------------------------------------
   CREATE MODAL
   --------------------------------------------------------- */

const showCreate = ref(false)
const createError = ref<string | null>(null)
const addErrors = reactive<Record<string, string>>({})

const form = reactive({
  firstName: '',
  lastName: '',
  gradeLevel: null as number | null,
  program: '' as string | null,
  isArchived: false as boolean | null,
})

function openCreate() {
  createError.value = null
  clearAddErrors()
  showCreate.value = true
}

function closeCreate() {
  showCreate.value = false
}

function clearAddErrors() {
  for (const k of Object.keys(addErrors)) delete addErrors[k]
}

function validateCreate(): boolean {
  clearAddErrors()
  if (!form.firstName.trim()) addErrors.firstName = 'First name is required.'
  if (!form.lastName.trim()) addErrors.lastName = 'Last name is required.'
  // gradeLevel & program optional for now
  return Object.keys(addErrors).length === 0
}

async function add() {
  if (!validateCreate()) return
  createError.value = null
  try {
    await create({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gradeLevel:
        form.gradeLevel !== null && form.gradeLevel !== undefined
          ? Number(form.gradeLevel)
          : null,
      program: form.program && form.program.trim() !== '' ? form.program.trim() : null,
      isArchived: !!form.isArchived,
    })
    Object.assign(form, {
      firstName: '',
      lastName: '',
      gradeLevel: null,
      program: '',
      isArchived: false,
    })
    closeCreate()
  } catch (e: any) {
    createError.value = e?.data?.message ?? e?.message ?? 'Failed to create student.'
  }
}

/* ---------------------------------------------------------
   EDIT MODAL
   --------------------------------------------------------- */

const showEdit = ref(false)
const editError = ref<string | null>(null)

const draft = reactive({
  id: 0,
  firstName: '',
  lastName: '',
  gradeLevel: null as number | null,
  program: '' as string | null,
  isArchived: false as boolean | null,
})

function openEdit(s: any) {
  editError.value = null
  Object.assign(draft, {
    id: s.id,
    firstName: s.firstName ?? '',
    lastName: s.lastName ?? '',
    gradeLevel:
      s.gradeLevel !== null && s.gradeLevel !== undefined ? Number(s.gradeLevel) : null,
    program: s.program ?? '',
    isArchived: !!s.isArchived,
  })
  showEdit.value = true
}

function closeEdit() {
  showEdit.value = false
}

async function saveEdit() {
  // Only require names
  if (!draft.firstName.trim() || !draft.lastName.trim()) {
    editError.value = 'First and last name are required.'
    return
  }

  try {
    await replace(draft.id, {
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      gradeLevel:
        draft.gradeLevel !== null && draft.gradeLevel !== undefined
          ? Number(draft.gradeLevel)
          : null,
      program:
        draft.program && draft.program.trim() !== ''
          ? draft.program.trim()
          : null,
      isArchived: !!draft.isArchived,
    })
    closeEdit()
  } catch (e: any) {
    editError.value = e?.data?.message ?? e?.message ?? 'Failed to save changes.'
  }
}

/* ---------------------------------------------------------
   DELETE (archive)
   --------------------------------------------------------- */

async function confirmDelete(id: number) {
  if (confirm('Are you sure you want to archive this student?')) {
    await remove(id)
  }
}

/* ---------------------------------------------------------
   FILTERS & SORTING (Supabase fields only)
   --------------------------------------------------------- */

const search = ref('')

type SortMode = 'name' | 'grade_desc' | 'grade_asc'
const sortMode = ref<SortMode>('name')

const gradeFilter = ref('All')
const grades = computed(() => {
  const set = new Set<string>()
  students.value.forEach((s: any) => {
    if (s.gradeLevel !== null && s.gradeLevel !== undefined) {
      set.add(String(s.gradeLevel))
    }
  })
  return ['All', ...Array.from(set).sort((a, b) => Number(a) - Number(b))]
})

const programFilter = ref('All')
const programs = computed(() => {
  const set = new Set<string>()
  students.value.forEach((s: any) => {
    const p = (s.program || '').trim()
    if (p) set.add(p)
  })
  return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
})

const visibleStudents = computed(() => {
  const q = search.value.trim().toLowerCase()

  let base = students.value.filter((s: any) => {
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

    const matchesGrade =
      gradeFilter.value === 'All' ||
      (s.gradeLevel !== null &&
        s.gradeLevel !== undefined &&
        String(s.gradeLevel) === gradeFilter.value)

    const matchesProgram =
      programFilter.value === 'All' ||
      (s.program || '').trim() === programFilter.value

    return matchesQ && matchesGrade && matchesProgram
  })

  if (sortMode.value === 'name') {
    base.sort((a: any, b: any) =>
      `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`),
    )
  } else if (sortMode.value === 'grade_desc') {
    base.sort(
      (a: any, b: any) =>
        (b.gradeLevel ?? Number.NEGATIVE_INFINITY) -
        (a.gradeLevel ?? Number.NEGATIVE_INFINITY),
    )
  } else if (sortMode.value === 'grade_asc') {
    base.sort(
      (a: any, b: any) =>
        (a.gradeLevel ?? Number.POSITIVE_INFINITY) -
        (b.gradeLevel ?? Number.POSITIVE_INFINITY),
    )
  }

  return base
})
</script>

<template>
  <!-- Background & spacer to clear the main app header -->
  <div class="min-h-screen bg-gradient-to-b from-[#f7feff] to-slate-100">
    <div class="pt-32"></div>


    <!-- Main content container -->
    <main class="max-w-6xl mx-auto px-4 pb-10 space-y-6">
      <!-- Card wrapper -->
      <section
        class="w-full bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden"
      >
        <!-- Teal header bar with title + Add Student button -->
        <StudentsHeader @add="openCreate" />

        <!-- Controls + table -->
        <div class="border-t border-slate-200">
          <!-- Filter / sort bar -->
          <div class="px-4 py-3 bg-slate-50/80 border-b border-slate-200">
            <StudentsControls
              v-model:search="search"
              v-model:sortMode="sortMode"
              v-model:gradeFilter="gradeFilter"
              v-model:programFilter="programFilter"
              :grades="grades"
              :programs="programs"
            />
          </div>

          <!-- Table area -->
          <div class="p-4 overflow-x-auto bg-white">
            <div
              v-if="pending"
              class="py-8 text-center text-sm text-slate-500"
            >
              Loading students…
            </div>

            <div
              v-else-if="error"
              class="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {{ error }}
            </div>

            <div v-else>
              <StudentsTable
                :rows="visibleStudents"
                @edit="openEdit"
                @delete="confirmDelete"
              />

              <p
                v-if="!pending && !error && visibleStudents.length === 0"
                class="mt-3 text-xs text-slate-500 italic text-center"
              >
                No students match your current filters.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Modals (sit outside the card so they overlay the whole screen) -->
      <StudentCreateModal
        :open="showCreate"
        :form="form"
        :errors="addErrors"
        :error-text="createError"
        @close="closeCreate"
        @save="add"
      />

      <StudentEditModal
        :open="showEdit"
        :draft="draft"
        :error-text="editError"
        @close="closeEdit"
        @save="saveEdit"
      />
    </main>
  </div>
</template>

