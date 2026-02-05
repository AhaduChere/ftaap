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

onServerPrefetch(() => refresh())

onMounted(async () => {
  await Promise.all([refresh(), loadOrganizations()])
})

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

 
  organizationId: null as number | null,
  notes: '' as string | null,

  isArchived: false as boolean | null,
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
  if (!form.firstName.trim()) addErrors.firstName = 'First name is required.'
  if (!form.lastName.trim()) addErrors.lastName = 'Last name is required.'
  if (form.organizationId === null || form.organizationId === undefined) {
    addErrors.organizationId = 'Organization is required.'
  }
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

      // required FK
      organizationId: Number(form.organizationId),

      //optional notes
      notes: form.notes && form.notes.trim() !== '' ? form.notes.trim() : null,

      isArchived: false,
    })

    Object.assign(form, {
      firstName: '',
      lastName: '',
      gradeLevel: null,
      program: '',
      organizationId: null,
      notes: '',
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

  organizationId: null as number | null,
  notes: '' as string | null,

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

    organizationId:
      s.organizationId !== null && s.organizationId !== undefined
        ? Number(s.organizationId)
        : null,
    notes: s.notes ?? '',

    isArchived: !!s.isArchived,
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
  if (!draft.firstName.trim() || !draft.lastName.trim()) {
    editError.value = 'First and last name are required.'
    return
  }
  if (draft.organizationId === null || draft.organizationId === undefined) {
    editError.value = 'Organization is required.'
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
      program: draft.program && draft.program.trim() !== '' ? draft.program.trim() : null,

      organizationId: Number(draft.organizationId),
      notes: draft.notes && draft.notes.trim() !== '' ? draft.notes.trim() : null,

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
  students.value.forEach((s: any) => {
    if (s.gradeLevel !== null && s.gradeLevel !== undefined) {
      set.add(String(s.gradeLevel))
    }
  })
  return ['All', ...Array.from(set).sort((a, b) => Number(a) - Number(b))]
})

const programs = computed(() => {
  const set = new Set<string>()
  students.value.forEach((s: any) => {
    const p = (s.program || '').trim()
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
  return students.value.map((s: any) => {
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
  normalizedStudents.value.forEach((s: any) => {
    const o = (s.organization || '').trim()
    if (o) set.add(o)
  })
  return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
})

const visibleStudents = computed(() => {
  const q = search.value.trim().toLowerCase()

  let base = normalizedStudents.value.filter((s: any) => {
    const fullName = `${s.lastName}, ${s.firstName}`.toLowerCase()
    const program = (s.program || '').toLowerCase()
    const organization = (s.organization || '').toLowerCase()
    const gradeStr =
      s.gradeLevel !== null && s.gradeLevel !== undefined ? String(s.gradeLevel) : ''

    const matchesQ =
      !q ||
      fullName.includes(q) ||
      program.includes(q) ||
      organization.includes(q) ||
      gradeStr.toLowerCase().includes(q)

    const matchesGrade =
      gradeFilter.value === 'All' ||
      (s.gradeLevel !== null &&
        s.gradeLevel !== undefined &&
        String(s.gradeLevel) === gradeFilter.value)

    const matchesProgram =
      programFilter.value === 'All' || (s.program || '').trim() === programFilter.value

    const matchesOrganization =
      organizationFilter.value === 'All' || (s.organization || '') === organizationFilter.value

    return matchesQ && matchesGrade && matchesProgram && matchesOrganization
  })

  if (sortMode.value === 'name') {
    base.sort((a: any, b: any) =>
      `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`),
    )
  } else if (sortMode.value === 'grade_desc') {
    base.sort(
      (a: any, b: any) =>
        (b.gradeLevel ?? Number.NEGATIVE_INFINITY) - (a.gradeLevel ?? Number.NEGATIVE_INFINITY),
    )
  } else if (sortMode.value === 'grade_asc') {
    base.sort(
      (a: any, b: any) =>
        (a.gradeLevel ?? Number.POSITIVE_INFINITY) - (b.gradeLevel ?? Number.POSITIVE_INFINITY),
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
