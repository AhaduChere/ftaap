<script setup lang="ts">
import { onMounted, onServerPrefetch, onActivated } from 'vue'
import StudentsHeader from '../components/students/StudentsHeader.vue'
import StudentsControls from '../components/students/StudentsControls.vue'
import StudentsTable from '../components/students/StudentsTable.vue'
import StudentCreateModal from '../components/students/StudentCreateModal.vue'
import StudentEditModal from '../components/students/StudentEditModal.vue'

const { students, pending, error, refresh, create, replace, remove } = useStudents()

/* ---------- Helpers ---------- */
function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, Number(n))) }
function validEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) }
function parseGrade(g: string | number): number {
  const n = Number(g); if (!isNaN(n)) return n
  const m = String(g).match(/\d+/); return m ? Number(m[0]) : 0
}

/* Tier & flag helpers (Core/Strategic/Intensive by DIBELS) */
type Tier = 'Core' | 'Strategic' | 'Intensive'
function dibelsTier(score?: number): Tier {
  const s = Number(score ?? 0)
  if (s >= 420) return 'Core'
  if (s >= 406) return 'Strategic'
  return 'Intensive'
}
function flagFillClass(score?: number) {
  const t = dibelsTier(score)
  if (t === 'Core') return 'fill-green-500'
  if (t === 'Strategic') return 'fill-yellow-400'
  return 'fill-red-500'
}

/* ---------- Fetch ---------- */
onServerPrefetch(() => refresh())
onMounted(() => refresh())
onActivated(() => refresh())

/* ---------- Create Modal (required validation) ---------- */
const showCreate = ref(false)
const createError = ref<string | null>(null)
const addErrors = reactive<Record<string, string>>({})

const form = reactive({
  firstName: '', lastName: '', grade: '',
  attendancePct: 0, teacher: '', email: '',
  dibelsScore: 0,
})

function openCreate() { createError.value = null; clearAddErrors(); showCreate.value = true }
function closeCreate() { showCreate.value = false }
function clearAddErrors() { for (const k of Object.keys(addErrors)) delete addErrors[k] }

function validateCreate(): boolean {
  clearAddErrors()
  if (!form.firstName.trim()) addErrors.firstName = 'First name is required.'
  if (!form.lastName.trim())  addErrors.lastName  = 'Last name is required.'
  if (!form.grade.trim())     addErrors.grade     = 'Grade is required.'
  if (!form.teacher.trim())   addErrors.teacher   = 'Teacher is required.'
  if (!form.email.trim())     addErrors.email     = 'Email is required.'
  else if (!validEmail(form.email.trim())) addErrors.email = 'Please enter a valid email address.'
  if (form.attendancePct === null || form.attendancePct === undefined || String(form.attendancePct) === '')
    addErrors.attendancePct = 'Attendance is required.'
  else if (isNaN(Number(form.attendancePct)) || Number(form.attendancePct) < 0 || Number(form.attendancePct) > 100)
    addErrors.attendancePct = 'Attendance must be between 0 and 100.'
  if (form.dibelsScore === null || form.dibelsScore === undefined || String(form.dibelsScore) === '')
    addErrors.dibelsScore = 'DIBELS score is required.'
  else if (isNaN(Number(form.dibelsScore)) || Number(form.dibelsScore) < 0 || Number(form.dibelsScore) > 500)
    addErrors.dibelsScore = 'DIBELS score must be between 0 and 500.'
  return Object.keys(addErrors).length === 0
}

async function add() {
  if (!validateCreate()) return
  createError.value = null
  try {
    await create({
      firstName: form.firstName.trim(),
      lastName:  form.lastName.trim(),
      grade:     form.grade.trim(),
      attendancePct: clamp(Number(form.attendancePct), 0, 100),
      teacher:   form.teacher.trim(),
      email:     form.email.trim(),
      dibelsScore: clamp(Number(form.dibelsScore), 0, 500),
    })
    Object.assign(form, { firstName: '', lastName: '', grade: '', attendancePct: 0, teacher: '', email: '', dibelsScore: 0 })
    closeCreate()
  } catch (e: any) {
    createError.value = e?.data?.message ?? e?.message ?? 'Failed to create student.'
  }
}

/* ---------- Edit Modal (prefilled) ---------- */
const showEdit = ref(false)
const editError = ref<string | null>(null)
const draft = reactive({
  id: 0, firstName: '', lastName: '', grade: '',
  attendancePct: 0, teacher: '', email: '',
  dibelsScore: 0,
})
function openEdit(s: any) {
  editError.value = null
  Object.assign(draft, {
    id: s.id,
    firstName: s.firstName ?? '',
    lastName: s.lastName ?? '',
    grade: s.grade ?? '',
    attendancePct: Number(s.attendancePct ?? 0),
    teacher: s.teacher ?? '',
    email: s.email ?? '',
    dibelsScore: Number(s.dibelsScore ?? 0),
  })
  showEdit.value = true
}
function closeEdit() { showEdit.value = false }
async function saveEdit() {
  if (!validEmail(draft.email)) { editError.value = 'Please enter a valid email address.'; return }
  try {
    await replace(draft.id, {
      firstName: draft.firstName.trim(),
      lastName:  draft.lastName.trim(),
      grade:     draft.grade.trim(),
      attendancePct: clamp(Number(draft.attendancePct), 0, 100),
      teacher:   draft.teacher.trim(),
      email:     draft.email.trim(),
      dibelsScore: clamp(Number(draft.dibelsScore), 0, 500),
    })
    closeEdit()
  } catch (e: any) {
    editError.value = e?.data?.message ?? e?.message ?? 'Failed to save changes.'
  }
}

/* ---------- Delete ---------- */
async function confirmDelete(id: number) {
  if (confirm('Are you sure you want to delete this student?')) await remove(id)
}

/* ---------- Filters & Sorting ---------- */
const search = ref('')
type SortMode = 'name' | 'grade_desc' | 'grade_asc' | 'dibels_desc' | 'dibels_asc'
const sortMode = ref<SortMode>('name')

const gradeFilter = ref('All')
const grades = computed(() => {
  const set = new Set<string>()
  students.value.forEach(s => { const g = (s.grade || '').trim(); if (g) set.add(g) })
  return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
})

const teacherFilter = ref('All')
const teachers = computed(() => {
  const set = new Set<string>()
  students.value.forEach(s => { const t = (s.teacher || '').trim(); if (t) set.add(t) })
  return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
})

function parseGradeSafe(v: unknown) { return parseGrade((v as any) ?? '') }

const visibleStudents = computed(() => {
  const q = search.value.trim().toLowerCase()
  let base = students.value.filter((s) => {
    const matchesQ =
      !q ||
      `${s.lastName}, ${s.firstName}`.toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.teacher || '').toLowerCase().includes(q) ||
      (s.grade || '').toLowerCase().includes(q)
    const matchesGrade   = gradeFilter.value === 'All' || s.grade === gradeFilter.value
    const matchesTeacher = teacherFilter.value === 'All' || s.teacher === teacherFilter.value
    return matchesQ && matchesGrade && matchesTeacher
  })

  if (sortMode.value === 'name') {
    base.sort((a, b) => `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`))
  } else if (sortMode.value === 'grade_desc') {
    base.sort((a, b) => parseGradeSafe(b.grade) - parseGradeSafe(a.grade))
  } else if (sortMode.value === 'grade_asc') {
    base.sort((a, b) => parseGradeSafe(a.grade) - parseGradeSafe(b.grade))
  } else if (sortMode.value === 'dibels_desc') {
    base.sort((a, b) => (b.dibelsScore ?? 0) - (a.dibelsScore ?? 0))
  } else if (sortMode.value === 'dibels_asc') {
    base.sort((a, b) => (a.dibelsScore ?? 0) - (b.dibelsScore ?? 0))
  }

  return base
})
</script>

<template>
  <!-- Spacer to push below fixed header -->
  <div class="h-24 md:h-16"></div>

  <div class="p-6 space-y-6 bg-[#f7feff] min-h-screen">
    <div class="w-full bg-white border border-[#2e777e] drop-shadow-lg rounded-md overflow-visible">

      <!-- Header -->
      <StudentsHeader @add="openCreate" />

      <!-- Controls -->
      <StudentsControls
        v-model:search="search"
        v-model:sortMode="sortMode"
        v-model:gradeFilter="gradeFilter"
        v-model:teacherFilter="teacherFilter"
        :grades="grades"
        :teachers="teachers"
      />

      <!-- Table -->
      <div class="p-4 overflow-x-auto">
        <div v-if="pending">Loading…</div>
        <div v-if="error" class="text-red-600">{{ error }}</div>

        <StudentsTable
          :rows="visibleStudents"
          :flag-fill-class="flagFillClass"
          :dibels-tier="dibelsTier"
          @edit="openEdit"
          @delete="confirmDelete"
        />
      </div>
    </div>

    <!-- Create Modal -->
    <StudentCreateModal
      :open="showCreate"
      :form="form"
      :errors="addErrors"
      :error-text="createError"
      @close="closeCreate"
      @save="add"
    />

    <!-- Edit Modal -->
    <StudentEditModal
      :open="showEdit"
      :draft="draft"
      :error-text="editError"
      @close="closeEdit"
      @save="saveEdit"
    />
  </div>
</template>
