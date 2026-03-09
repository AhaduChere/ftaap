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
import StudentsHeader from '@/components/students/StudentsHeader.vue'
import StudentsControls from '@/components/students/StudentsControls.vue'

import StudentCreateModal from '@/components/students/StudentCreateModal.vue'
import StudentEditModal from '@/components/students/StudentEditModal.vue'
import StudentsTable from '@/components/students/StudentsTable.vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import type {Student} from '../../types/student'

const { $supabase } = useNuxtApp();
const supabase = $supabase as SupabaseClient
const user = ref();
let id:string = '';

// Composable: API + state
const { students, pending, error, refresh, create, replace, remove } = useStudents()

/* ---------------------------------------------------------
   Organizations for dropdown (Create/Edit modals)
   --------------------------------------------------------- */

type OrganizationOption = {
  id: number
  organization_name: string
}

const organizations = ref<OrganizationOption[]>([])
const orgsPending = ref(false)
const orgsError = ref<string | null>(null)

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

/* ---------------------------------------------------------
   Lifecycle
   --------------------------------------------------------- */

onServerPrefetch(() => refresh(id))

onMounted(async () => {
  user.value = await supabase.auth.getUser();
  id = user.value.data.user.id;
  await refresh(id);
  await loadOrganizations();
})

onActivated(() => refresh(id))

/* ---------------------------------------------------------
   CREATE MODAL
   --------------------------------------------------------- */

const showCreate = ref(false)
const createError = ref<string | null>(null)
const addErrors = reactive<Record<string, string>>({})

const form = reactive({
  student_fname: '',
  student_lname: '',
  student_grade_level: null as number | null,
  student_program: '' as string | null,

 
  organization_id: null as number | null,
  student_notes: '' as string | null,

  is_archived: false as boolean | null,
})

function openCreate() {
  createError.value = null
  clearAddErrors()

  // Ensure dropdown has data
  if (organizations.value.length === 0 && !orgsPending.value) {
    loadOrganizations()
  }

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
  if (!form.student_fname.trim()) addErrors.firstName = 'First name is required.'
  if (!form.student_lname.trim()) addErrors.lastName = 'Last name is required.'
  if (form.organization_id === null || form.organization_id === undefined) {
    addErrors.organizationId = 'Organization is required.'
  }
  return Object.keys(addErrors).length === 0
}

async function add() {
  if (!validateCreate()) return
  createError.value = null

  try {
    await create({
      firstName: form.student_fname.trim(),
      lastName: form.student_lname.trim(),
      gradeLevel:
        form.student_grade_level !== null && form.student_grade_level !== undefined
          ? Number(form.student_grade_level)
          : null,
      program: form.student_program && form.student_program.trim() !== '' ? form.student_program.trim() : null,

      // required FK
      organizationId: Number(form.organization_id),

      //optional notes
      notes: form.student_notes && form.student_notes.trim() !== '' ? form.student_notes.trim() : null,

      isArchived: false,
    }, id)

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

/* ---------------------------------------------------------
   EDIT MODAL
   --------------------------------------------------------- */

const showEdit = ref(false)
const editError = ref<string | null>(null)

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

function openEdit(s: Student) {
  editError.value = null

  Object.assign(draft, {
    student_id: s.student_id,
    student_fname: s.student_fname ?? '',
    student_lname: s.student_lname ?? '',
    student_grade_level:
      s.student_grade_level !== null && s.student_grade_level !== undefined ? Number(s.student_grade_level) : null,
    student_program: s.student_program ?? '',

    organization_id:
      s.organization_id !== null && s.organization_id !== undefined
        ? Number(s.organization_id)
        : null,
    student_notes: s.student_notes ?? '',

    is_archived: !!s.is_archived,
  })

  // Ensure dropdown has data
  if (organizations.value.length === 0 && !orgsPending.value) {
    loadOrganizations()
  }

  showEdit.value = true
}

function closeEdit() {
  showEdit.value = false
}

async function saveEdit() {
  if (!draft.student_fname.trim() || !draft.student_lname.trim()) {
    editError.value = 'First and last name are required.'
    return
  }
  if (draft.organization_id === null || draft.organization_id === undefined) {
    editError.value = 'Organization is required.'
    return
  }

  try {
    await replace(draft.student_id, {
      firstName: draft.student_fname.trim(),
      lastName: draft.student_lname.trim(),
      gradeLevel:
        draft.student_grade_level !== null && draft.student_grade_level !== undefined
          ? Number(draft.student_grade_level)
          : null,
      program: draft.student_program && draft.student_program.trim() !== '' ? draft.student_program.trim() : null,

      organizationId: Number(draft.organization_id),
      notes: draft.student_notes && draft.student_notes.trim() !== '' ? draft.student_notes.trim() : null,

      isArchived: !!draft.is_archived,
    }, id)

    closeEdit()
  } catch (e: any) {
    editError.value = e?.data?.message ?? e?.message ?? 'Failed to save changes.'
  }
}

/* ---------------------------------------------------------
   DELETE (archive)
   --------------------------------------------------------- */

async function confirmDelete(student_id: number) {
  if (confirm('Are you sure you want to archive this student?')) {
    await remove(student_id, id)
  }
}

/* ---------------------------------------------------------
   FILTERS & SORTING
   --------------------------------------------------------- */

const search = ref('')

type SortMode = 'name' | 'grade_desc' | 'grade_asc'
const sortMode = ref<SortMode>('name')

const gradeFilter = ref('All')
const programFilter = ref('All')
const organizationFilter = ref('All')

const grades = computed(() => {
  const set = new Set<string>()
  students.value.forEach((s: Student) => {
    if (s.student_grade_level !== null && s.student_grade_level !== undefined) {
      set.add(String(s.student_grade_level))
    }
  })
  return ['All', ...Array.from(set).sort((a, b) => Number(a) - Number(b))]
})

const programs = computed(() => {
  const set = new Set<string>()
  students.value.forEach((s: Student) => {
    const p = (s.student_program || '').trim()
    if (p) set.add(p)
  })
  return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
})

/**
 * CHANGE: normalize org display to "None" when missing
 * We do it once here so:
 * - table shows "None"
 * - search + filters include "None"
 */
const normalizedStudents = computed(() => {
  console.log(students.value);
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

const organizationNames = computed(() => {
  const set = new Set<string>()
  normalizedStudents.value.forEach((s: Student) => {
    const o = (s.organization || '').trim()
    if (o) set.add(o)
  })
  return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
})

const visibleStudents = computed(() => {
  const q = search.value.trim().toLowerCase()

  let base = normalizedStudents.value.filter((s: Student) => {
    const fullName = `${s.student_lname}, ${s.student_fname}`.toLowerCase()
    const program = (s.student_program || '').toLowerCase()
    const organization = (s.organization || '').toLowerCase()
    const gradeStr =
      s.student_grade_level !== null && s.student_grade_level !== undefined ? String(s.student_grade_level) : ''

    const matchesQ =
      !q ||
      fullName.includes(q) ||
      program.includes(q) ||
      organization.includes(q) ||
      gradeStr.toLowerCase().includes(q)

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

  if (sortMode.value === 'name') {
    base.sort((a: Student, b: Student) =>
      `${a.student_lname}${a.student_fname}`.localeCompare(`${b.student_lname}${b.student_fname}`),
    )
  } else if (sortMode.value === 'grade_desc') {
    base.sort(
      (a: Student, b: Student) =>
        (b.student_grade_level ?? Number.NEGATIVE_INFINITY) - (a.student_grade_level ?? Number.NEGATIVE_INFINITY),
    )
  } else if (sortMode.value === 'grade_asc') {
    base.sort(
      (a: Student, b: Student) =>
        (a.student_grade_level ?? Number.POSITIVE_INFINITY) - (b.student_grade_level ?? Number.POSITIVE_INFINITY),
    )
  }

  return base
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#f7feff] to-slate-100">
    <div class="pt-32"></div>

    <main class="max-w-6xl mx-auto px-4 pb-10 space-y-6">
      <section class="w-full bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden">
        <StudentsHeader @add="openCreate" />

        <div class="border-t border-slate-200">
          <div class="px-4 py-3 bg-slate-50/80 border-b border-slate-200">
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

            <p v-if="orgsError" class="mt-2 text-xs text-red-600">
              {{ orgsError }}
            </p>
          </div>

          <div class="p-4 overflow-x-auto bg-white">
            <div v-if="pending" class="py-8 text-center text-sm text-slate-500">
              Loading students…
            </div>

            <div
              v-else-if="error"
              class="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {{ error }}
            </div>

            <div v-else>
              <StudentsTable :rows="visibleStudents" @edit="openEdit" @delete="confirmDelete" />

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

      <StudentCreateModal
        :open="showCreate"
        :form="form"
        :organizations="organizations"
        :errors="addErrors"
        :error-text="createError"
        @close="closeCreate"
        @save="add"
      />

      <StudentEditModal
        :open="showEdit"
        :draft="draft"
        :organizations="organizations"
        :error-text="editError"
        @close="closeEdit"
        @save="saveEdit"
      />
    </main>
  </div>
</template>
