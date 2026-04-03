// manageStudents.vue
// Main page component for managing students.
// This component handles:
// - fetching and refreshing student data for the current teacher
// - loading organization options
// - creating, editing, and archiving students
// - managing modal state for create/edit flows
// - filtering, sorting, and searching students
// - passing processed data to child components for display


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

// Child components used to build the page UI
import StudentsHeader from '@/components/students/StudentsHeader.vue'
import StudentsControls from '@/components/students/StudentsControls.vue'
import StudentCreateModal from '@/components/students/StudentCreateModal.vue'
import StudentEditModal from '@/components/students/StudentEditModal.vue'
import StudentsTable from '@/components/students/StudentsTable.vue'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Student } from '../../types/student'
import { useNuxtApp } from 'nuxt/app'

// Access supabase client from Nuxt app
const { $supabase } = useNuxtApp()
const supabase = $supabase as SupabaseClient

// Current authenticated user
const user = ref()
let id: string = '' // teacher/user id used for filtering

// Centralized student state + CRUD functions
const { students, pending, error, refresh, create, replace, remove } = useStudents()

// Organization type for dropdown options
type OrganizationOption = {
  id: number
  organization_name: string
}

// Organization state
const organizations = ref<OrganizationOption[]>([])
const orgsPending = ref(false)
const orgsError = ref<string | null>(null)

// Fetch organizations from API
async function loadOrganizations() {
  orgsPending.value = true
  orgsError.value = null
  try {
    const rows = await $fetch<OrganizationOption[]>('/api/organizations')
    organizations.value = Array.isArray(rows) ? rows : []
  } catch (e: any) {
    orgsError.value = e?.data?.message ?? e?.message ?? 'Failed to load organizations.'
    organizations.value = []
  } finally {
    orgsPending.value = false
  }
}

// Prefetch students on server-side render
onServerPrefetch(() => refresh(id))

// On mount, fetch user + students + organizations
onMounted(async () => {
  user.value = await supabase.auth.getUser()
  id = user.value.data.user.id
  await refresh(id)
  await loadOrganizations()
})

// Refresh students when component is re-activated
onActivated(() => refresh(id))

// ---------------- CREATE FLOW ----------------

// Controls visibility of create modal
const showCreate = ref(false)

// Error state for create modal
const createError = ref<string | null>(null)

// Field-level validation errors
const addErrors = reactive<Record<string, string>>({})

// Form state for creating a student
const form = reactive({
  student_fname: '',
  student_lname: '',
  student_grade_level: null as number | null,
  student_program: '' as string | null,
  organization_id: null as number | null,
  student_notes: '' as string | null,
  is_archived: false as boolean | null,
})

// Open create modal
function openCreate() {
  createError.value = null
  clearAddErrors()

  // Ensure organizations are loaded before opening
  if (organizations.value.length === 0 && !orgsPending.value) {
    loadOrganizations()
  }

  showCreate.value = true
}

// Close create modal
function closeCreate() {
  showCreate.value = false
}

// Clear validation errors
function clearAddErrors() {
  for (const k of Object.keys(addErrors)) delete addErrors[k]
}

// Validate create form fields
function validateCreate(): boolean {
  clearAddErrors()

  if (!form.student_fname.trim()) addErrors.firstName = 'First name is required.'
  if (!form.student_lname.trim()) addErrors.lastName = 'Last name is required.'

  if (
    form.student_grade_level !== null &&
    form.student_grade_level !== undefined &&
    Number(form.student_grade_level) < 1
  ) {
    addErrors.gradeLevel = 'Grade level must be at least 1.'
  }

  if (form.organization_id === null || form.organization_id === undefined) {
    addErrors.organizationId = 'Organization is required.'
  }

  return Object.keys(addErrors).length === 0
}

// Create new student
async function add() {
  if (!validateCreate()) return
  createError.value = null

  try {
    await create(
      {
        firstName: form.student_fname.trim(),
        lastName: form.student_lname.trim(),
        gradeLevel:
          form.student_grade_level !== null && form.student_grade_level !== undefined
            ? Math.max(1, Number(form.student_grade_level))
            : null,
        program:
          form.student_program && form.student_program.trim() !== ''
            ? form.student_program.trim()
            : null,
        organizationId: Number(form.organization_id),
        notes:
          form.student_notes && form.student_notes.trim() !== ''
            ? form.student_notes.trim()
            : null,
        isArchived: false,
      },
      id,
    )

    // Reset form after successful creation
    Object.assign(form, {
      student_fname: '',
      student_lname: '',
      student_grade_level: null,
      student_program: '',
      organization_id: null,
      student_notes: '',
      is_archived: false,
    })

    closeCreate()
  } catch (e: any) {
    createError.value = e?.data?.message ?? e?.message ?? 'Failed to create student.'
  }
}

// ---------------- EDIT FLOW ----------------

// Controls visibility of edit modal
const showEdit = ref(false)

// Error state for edit modal
const editError = ref<string | null>(null)

// Draft state for editing a student
const draft = reactive({
  student_id: 0,
  student_fname: '',
  student_lname: '',
  student_grade_level: null as number | null,
  student_program: '' as string | null,
  organization_id: null as number | null,
  student_notes: '' as string | null,
  is_archived: false as boolean | null,
})

// Open edit modal and populate draft
function openEdit(s: Student) {
  editError.value = null

  Object.assign(draft, {
    student_id: s.student_id,
    student_fname: s.student_fname ?? '',
    student_lname: s.student_lname ?? '',
    student_grade_level:
      s.student_grade_level !== null && s.student_grade_level !== undefined
        ? Number(s.student_grade_level)
        : null,
    student_program: s.student_program ?? '',
    organization_id:
      s.organization_id !== null && s.organization_id !== undefined
        ? Number(s.organization_id)
        : null,
    student_notes: s.student_notes ?? '',
    is_archived: !!s.is_archived,
  })

  // Ensure organizations are loaded
  if (organizations.value.length === 0 && !orgsPending.value) {
    loadOrganizations()
  }

  showEdit.value = true
}

// Close edit modal
function closeEdit() {
  showEdit.value = false
}

// Save edited student
async function saveEdit() {
  if (!draft.student_fname.trim() || !draft.student_lname.trim()) {
    editError.value = 'First and last name are required.'
    return
  }

  if (
    draft.student_grade_level !== null &&
    draft.student_grade_level !== undefined &&
    Number(draft.student_grade_level) < 1
  ) {
    editError.value = 'Grade level must be at least 1.'
    return
  }

  if (draft.organization_id === null || draft.organization_id === undefined) {
    editError.value = 'Organization is required.'
    return
  }

  try {
    await replace(
      draft.student_id,
      {
        firstName: draft.student_fname.trim(),
        lastName: draft.student_lname.trim(),
        gradeLevel:
          draft.student_grade_level !== null && draft.student_grade_level !== undefined
            ? Math.max(1, Number(draft.student_grade_level))
            : null,
        program:
          draft.student_program && draft.student_program.trim() !== ''
            ? draft.student_program.trim()
            : null,
        organizationId: Number(draft.organization_id),
        notes:
          draft.student_notes && draft.student_notes.trim() !== ''
            ? draft.student_notes.trim()
            : null,
        isArchived: !!draft.is_archived,
      },
      id,
    )

    closeEdit()
  } catch (e: any) {
    editError.value = e?.data?.message ?? e?.message ?? 'Failed to save changes.'
  }
}

// Confirm archive action
async function confirmDelete(student_id: number) {
  if (confirm('Are you sure you want to archive this student?')) {
    await remove(student_id, id)
  }
}

// ---------------- FILTERING + SORTING ----------------

// Search query
const search = ref('')

// Sorting mode
type SortMode = 'name' | 'grade_desc' | 'grade_asc'
const sortMode = ref<SortMode>('name')

// Filter states
const gradeFilter = ref('All')
const programFilter = ref('All')
const organizationFilter = ref('All')

// Unique grade options derived from students
const grades = computed(() => {
  const set = new Set<string>()
  students.value.forEach((s: Student) => {
    if (s.student_grade_level !== null && s.student_grade_level !== undefined) {
      set.add(String(s.student_grade_level))
    }
  })
  return ['All', ...Array.from(set).sort((a, b) => Number(a) - Number(b))]
})

// Unique program options
const programs = computed(() => {
  const set = new Set<string>()
  students.value.forEach((s: Student) => {
    const p = (s.student_program || '').trim()
    if (p) set.add(p)
  })
  return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
})

// Program list without "All" (used for autocomplete)
const existingPrograms = computed(() => {
  return programs.value.filter((p) => p !== 'All')
})

// Normalize organization values
const normalizedStudents = computed(() => {
  return students.value.map((s: Student) => {
    const org =
      s.organization && String(s.organization).trim() !== ''
        ? String(s.organization).trim()
        : 'None'

    return {
      ...s,
      organization: org,
    }
  })
})

// Unique organization options
const organizationNames = computed(() => {
  const set = new Set<string>()
  normalizedStudents.value.forEach((s: Student) => {
    const o = (s.organization || '').trim()
    if (o) set.add(o)
  })
  return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
})

// Final filtered + sorted student list
const visibleStudents = computed(() => {
  const q = search.value.trim().toLowerCase()

  let base = normalizedStudents.value.filter((s: Student) => {
    const fullName = `${s.student_lname}, ${s.student_fname}`.toLowerCase()
    const program = (s.student_program || '').toLowerCase()
    const organization = (s.organization || '').toLowerCase()
    const gradeStr =
      s.student_grade_level !== null && s.student_grade_level !== undefined
        ? String(s.student_grade_level)
        : ''

    // Search matching
    const matchesQ =
      !q ||
      fullName.includes(q) ||
      program.includes(q) ||
      organization.includes(q) ||
      gradeStr.includes(q)

    // Filter matching
    const matchesGrade =
      gradeFilter.value === 'All' ||
      (s.student_grade_level !== null &&
        s.student_grade_level !== undefined &&
        String(s.student_grade_level) === gradeFilter.value)

    const matchesProgram =
      programFilter.value === 'All' || (s.student_program || '').trim() === programFilter.value

    const matchesOrganization =
      organizationFilter.value === 'All' || (s.organization || '') === organizationFilter.value

    return matchesQ && matchesGrade && matchesProgram && matchesOrganization
  })

  // Sorting logic
  if (sortMode.value === 'name') {
    base.sort((a: Student, b: Student) =>
      `${a.student_lname}${a.student_fname}`.localeCompare(
        `${b.student_lname}${b.student_fname}`,
      ),
    )
  } else if (sortMode.value === 'grade_desc') {
    base.sort(
      (a: Student, b: Student) =>
        (b.student_grade_level ?? Number.NEGATIVE_INFINITY) -
        (a.student_grade_level ?? Number.NEGATIVE_INFINITY),
    )
  } else if (sortMode.value === 'grade_asc') {
    base.sort(
      (a: Student, b: Student) =>
        (a.student_grade_level ?? Number.POSITIVE_INFINITY) -
        (b.student_grade_level ?? Number.POSITIVE_INFINITY),
    )
  }

  return base
})
</script>

<template>
  <!-- Full page background -->
  <div class="h-screen overflow-hidden bg-gradient-to-b from-[#f7feff] to-slate-100">
    <div class="h-full flex flex-col">
      <!-- Top spacing -->
      <div class="pt-32 shrink-0"></div>

      <!-- Main content container -->
      <main class="max-w-6xl mx-auto px-4 pb-4 flex-1 min-h-0 w-full">
        <section
          class="w-full max-h-full bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden flex flex-col"
        >
          <!-- Header -->
          <div class="shrink-0">
            <StudentsHeader @add="openCreate" />
          </div>

          <!-- Controls + table -->
          <div class="border-t border-slate-200 flex flex-col">
            <!-- Filters -->
            <div class="px-4 py-3 bg-slate-50/80 border-b border-slate-200 shrink-0">
              <StudentsControls
                v-model:search="search"
                v-model:sortMode="sortMode"
                v-model:gradeFilter="gradeFilter"
                v-model:programFilter="programFilter"
                v-model:organizationFilter="organizationFilter"
                :grades="grades"
                :programs="programs"
                :organizations="organizationNames"
              />

              <!-- Organization error -->
              <p v-if="orgsError" class="mt-2 text-xs text-red-600">
                {{ orgsError }}
              </p>
            </div>

            <!-- Table section -->
            <div class="p-4 bg-white">
              <!-- Loading state -->
              <div v-if="pending" class="py-8 text-center text-sm text-slate-500">
                Loading students…
              </div>

              <!-- Error state -->
              <div
                v-else-if="error"
                class="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {{ error }}
              </div>

              <!-- Table -->
              <div v-else>
                <StudentsTable
                  :rows="visibleStudents"
                  @edit="openEdit"
                  @delete="confirmDelete"
                  v-model:sortMode="sortMode"
                />

                <!-- Empty state -->
                <p
                  v-if="visibleStudents.length === 0"
                  class="mt-3 text-xs text-slate-500 italic text-center"
                >
                  No students match your current filters.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Create modal -->
        <StudentCreateModal
          :open="showCreate"
          :form="form"
          :organizations="organizations"
          :program-options="existingPrograms"
          :errors="addErrors"
          :error-text="createError"
          @close="closeCreate"
          @save="add"
        />

        <!-- Edit modal -->
        <StudentEditModal
          :open="showEdit"
          :draft="draft"
          :organizations="organizations"
          :program-options="existingPrograms"
          :error-text="editError"
          @close="closeEdit"
          @save="saveEdit"
        />
      </main>
    </div>
  </div>
</template>