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

// types
import type { StudentScore } from '../../types/studentScore'
import type { StudentOption } from '../../types/studentOption'
import type { SupabaseClient } from '@supabase/supabase-js'

// Child components
import ScoresHeader from '~/components/scores/scoresHeader.vue'
import ScoresControls from '~/components/scores/scoresControls.vue'
import ScoresTable from '~/components/scores/scoresTable.vue'
import ScoreCreateModal from '@/components/scores/scoreCreateModal.vue'
import ScoreEditModal from '@/components/scores/scoreEditModal.vue'
import type { Student } from '~~/types/student'

// Composable: API + state
const { students, error, refresh, pending } = useStudents()

const { $supabase } = useNuxtApp()
const supabase = $supabase as SupabaseClient
const user = ref()
let id: string = ''

type row = StudentScore & {
  student_full_name: string
}

/* ---------------------------------------------------------
   Map Students to StudentOption
--------------------------------------------------------- */
const studentList = computed<StudentOption[]>(() => {
  return students.value.map((s: Student) => ({
    student_id: s.student_id,
    student_fname: s.student_fname,
    student_lname: s.student_lname,
  }))
})

const scores = ref<row[]>([])
const scoresPending = ref(false)
const scoresError = ref<string | null>(null)

const studentMap = computed(() =>
  Object.fromEntries(students.value.map((s) => [s.student_id, s])),
)

//load scores and map them to the correct student to create the rows
//return [] if there are no scores or if an error occurs
async function loadScores(){ 
    scoresPending.value = true;
    scoresError.value = null;

  try {
    const rows = await $fetch<StudentScore[]>('/api/scores/scores')

    if (Array.isArray(rows) && students.value) {
      scores.value = rows
        .map((s): row | null => {
          const student = studentMap.value[s.student_id]

          if (!student) return null

          return {
            ...s,
            student_full_name: `${student.student_fname} ${student.student_lname}`,
          }
        })
        .filter((r): r is row => r !== null)
    } else {
      scores.value = []
    }
  } catch (e: any) {
    scoresError.value =
      e?.data?.message ??
      e?.message ??
      'Failed to load scores.'

    scores.value = []
  } finally {
    scoresPending.value = false
  }
}

/* ---------------------------------------------------------
   Lifecycle
--------------------------------------------------------- */
onServerPrefetch(() => refresh(id))

onMounted(async () => {
  user.value = await supabase.auth.getUser()
  id = user.value.data.user.id
  await refresh(id)
  await loadScores()
})

onActivated(() => refresh(id))

/* ---------------------------------------------------------
   CREATE MODAL
--------------------------------------------------------- */
const showCreate = ref(false)
const createError = ref<string | null>(null)
const addErrors = reactive<Record<string, string>>({})

const form = reactive({
  student_dibel_score: null as number | null,
  student_dibel_ORF: null as number | null,
  student_dibel_MAZE: null as number | null,
  student_fluency_score: null as number | null,
  student_comprehension_score: null as number | null,
  student_vocab_score: null as number | null,
  selectedStudentId: null as number | null,
  student_known_words: null as string | null,
  student_unknown_words: null as string | null,
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

//make sure a student is selected before creating a new score
function validateCreate(): boolean {
  clearAddErrors()
  if (!form.selectedStudentId) addErrors.selectedStudent = 'Student is required.'
  return Object.keys(addErrors).length === 0
}

//add new scores to the database
async function add() {
  if (!validateCreate()) return
  createError.value = null

  const payload = {
    student_id: Number(form.selectedStudentId),

    student_dibel_score:
      form.student_dibel_score != null ? Number(form.student_dibel_score) : null,

    student_dibel_ORF:
      form.student_dibel_ORF != null ? Number(form.student_dibel_ORF) : null,

    student_dibel_MAZE:
      form.student_dibel_MAZE != null ? Number(form.student_dibel_MAZE) : null,

    student_fluency_score:
      form.student_fluency_score != null ? Number(form.student_fluency_score) : null,

    student_comprehension_score:
      form.student_comprehension_score != null ? Number(form.student_comprehension_score) : null,

    student_vocab_score:
      form.student_vocab_score != null ? Number(form.student_vocab_score) : null,

    student_known_words: form.student_known_words?.split(',') ?? [],
    student_unknown_words: form.student_unknown_words?.split(',') ?? [],
    inserted_date: new Date().toISOString(),
  }

  try {
    await fetch('/api/scores/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    Object.assign(form, {
      student_dibel_score: null,
      student_dibel_ORF: null,
      student_dibel_MAZE: null,
      student_fluency_score: null,
      student_comprehension_score: null,
      student_vocab_score: null,
      selectedStudentId: null,
      student_known_words: null,
      student_unknown_words: null,
    })

    await loadScores()
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
  student_score_id: null as number | null,
  student_dibel_score: null as number | null,
  student_dibel_ORF: null as number | null,
  student_dibel_MAZE: null as number | null,
  student_fluency_score: null as number | null,
  student_comprehension_score: null as number | null,
  student_vocab_score: null as number | null,
  student_known_words: '',
  student_unknown_words: '',
  selectedStudentId: null as number | null,
})

function openEdit(s: StudentScore) {
  editError.value = null

  Object.assign(draft, {
    student_score_id: s.student_score_id,
    student_dibel_score:
      s.student_dibel_score !== null && s.student_dibel_score !== undefined
        ? Number(s.student_dibel_score)
        : null,
    student_dibel_ORF:
      s.student_dibel_ORF !== null && s.student_dibel_ORF !== undefined
        ? Number(s.student_dibel_ORF)
        : null,
    student_dibel_MAZE:
      s.student_dibel_MAZE !== null && s.student_dibel_MAZE !== undefined
        ? Number(s.student_dibel_MAZE)
        : null,
    student_fluency_score:
      s.student_fluency_score !== null && s.student_fluency_score !== undefined
        ? Number(s.student_fluency_score)
        : null,
    student_comprehension_score:
      s.student_comprehension_score !== null && s.student_comprehension_score !== undefined
        ? Number(s.student_comprehension_score)
        : null,
    student_vocab_score:
      s.student_vocab_score !== null && s.student_vocab_score !== undefined
        ? Number(s.student_vocab_score)
        : null,
    student_known_words: s.student_known_words ?? '',
    student_unknown_words: s.student_unknown_words ?? '',
    selectedStudentId: s.student_id,
  })

  showEdit.value = true
}

function closeEdit() {
  showEdit.value = false
}

async function saveEdit() {
  if (!draft.selectedStudentId || !draft.student_score_id) {
    editError.value = 'Must select a student'
    return
  }

  try {
    const payload = {
        student_score_id: draft.student_score_id,
        student_dibel_score: draft.student_dibel_score ?? null,
        student_dibel_ORF: draft.student_dibel_ORF ?? null,
        student_dibel_MAZE: draft.student_dibel_MAZE ?? null,
        student_fluency_score: draft.student_fluency_score ?? null,
        student_comprehension_score: draft.student_comprehension_score ?? null,
        student_vocab_score: draft.student_vocab_score ?? null,
        student_id: draft.selectedStudentId,
        student_unknown_words: draft.student_unknown_words ?? [],
        student_known_words: draft.student_known_words ?? []
    }

    await fetch('/api/scores/scores', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    await loadScores()
    closeEdit()
  } catch (e: any) {
    editError.value = e?.data?.message ?? e?.message ?? 'Failed to save changes.'
  }
}

/* ---------------------------------------------------------
   FILTERS & SORTING
--------------------------------------------------------- */
const search = ref('')

type SortMode =
  | 'dibel_avg_desc'
  | 'dibel_avg_asc'
  | 'fluency_desc'
  | 'fluency_asc'
  | 'comprehension_desc'
  | 'comprehension_asc'
  | 'vocab_desc'
  | 'vocab_asc'

const sortMode = ref<SortMode>('dibel_avg_desc')

function computeDibelAvg(dibel: number, MAZE: number, ORF: number) {
  return (dibel + MAZE + ORF) / 3
}

//display the scores based on the current sort
const visibleScores = computed(() => {
  const q = search.value.trim().toLowerCase()

  let base = scores.value.filter((s: row) => {
    const fullName = s.student_full_name.toLowerCase()
    return !q || fullName.includes(q)
  })

  base.sort((a: row, b: row) =>
    a.student_full_name.localeCompare(b.student_full_name),
  )

  if (sortMode.value === 'dibel_avg_desc') {
    base.sort(
      (a: row, b: row) =>
        (computeDibelAvg(
          b.student_dibel_score,
          b.student_dibel_MAZE,
          b.student_dibel_ORF,
        ) ?? Number.NEGATIVE_INFINITY) -
        (computeDibelAvg(
          a.student_dibel_score,
          a.student_dibel_MAZE,
          a.student_dibel_ORF,
        ) ?? Number.NEGATIVE_INFINITY),
    )
  } else if (sortMode.value === 'dibel_avg_asc') {
    base.sort(
      (a: row, b: row) =>
        (computeDibelAvg(
          a.student_dibel_score,
          a.student_dibel_MAZE,
          a.student_dibel_ORF,
        ) ?? Number.POSITIVE_INFINITY) -
        (computeDibelAvg(
          b.student_dibel_score,
          b.student_dibel_MAZE,
          b.student_dibel_ORF,
        ) ?? Number.POSITIVE_INFINITY),
    )
  } else if (sortMode.value === 'fluency_desc') {
    base.sort(
      (a: StudentScore, b: StudentScore) =>
        (b.student_fluency_score ?? Number.NEGATIVE_INFINITY) -
        (a.student_fluency_score ?? Number.NEGATIVE_INFINITY),
    )
  } else if (sortMode.value === 'fluency_asc') {
    base.sort(
      (a: StudentScore, b: StudentScore) =>
        (a.student_fluency_score ?? Number.POSITIVE_INFINITY) -
        (b.student_fluency_score ?? Number.POSITIVE_INFINITY),
    )
  } else if (sortMode.value === 'comprehension_desc') {
    base.sort(
      (a: StudentScore, b: StudentScore) =>
        (b.student_comprehension_score ?? Number.NEGATIVE_INFINITY) -
        (a.student_comprehension_score ?? Number.NEGATIVE_INFINITY),
    )
  } else if (sortMode.value === 'comprehension_asc') {
    base.sort(
      (a: StudentScore, b: StudentScore) =>
        (a.student_comprehension_score ?? Number.POSITIVE_INFINITY) -
        (b.student_comprehension_score ?? Number.POSITIVE_INFINITY),
    )
  } else if (sortMode.value === 'vocab_desc') {
    base.sort(
      (a: StudentScore, b: StudentScore) =>
        (b.student_vocab_score ?? Number.NEGATIVE_INFINITY) -
        (a.student_vocab_score ?? Number.NEGATIVE_INFINITY),
    )
  } else if (sortMode.value === 'vocab_asc') {
    base.sort(
      (a: StudentScore, b: StudentScore) =>
        (a.student_vocab_score ?? Number.POSITIVE_INFINITY) -
        (b.student_vocab_score ?? Number.POSITIVE_INFINITY),
    )
  }

  return base
})
</script>

<template>
  <div class="h-screen overflow-hidden bg-gradient-to-b from-[#f7feff] to-slate-100">
    <div class="h-full flex flex-col">
      <div class="pt-32 shrink-0"></div>

      <main class="max-w-6xl mx-auto px-4 pb-4 flex-1 min-h-0 w-full">
        <section
          class="w-full max-h-full bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden flex flex-col"
        >
          <div class="shrink-0">
            <ScoresHeader @add="openCreate" />
          </div>

          <div class="border-t border-slate-200 flex flex-col">
            <div class="px-4 py-3 bg-slate-50/80 border-b border-slate-200 shrink-0">
              <ScoresControls
                v-model:search="search"
                v-model:sortMode="sortMode"
              />

              <p v-if="scoresError" class="mt-2 text-xs text-red-600">
                {{ scoresError }}
              </p>
            </div>

            <div class="p-4 bg-white">
              <div v-if="scoresPending || pending" class="py-8 text-center text-sm text-slate-500">
                Loading students scores…
              </div>

              <div
                v-else-if="error"
                class="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {{ error }}
              </div>

              <div v-else>
                <ScoresTable :rows="visibleScores" @edit="openEdit" />

                <p
                  v-if="!scoresPending && !pending && !scoresError && scores.length === 0"
                  class="mt-3 text-xs text-slate-500 italic text-center"
                >
                  No student scores match your current filters.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ScoreCreateModal
          :studentList="studentList"
          :open="showCreate"
          :form="form"
          :errors="addErrors"
          :error-text="createError"
          @close="closeCreate"
          @save="add"
        />

        <ScoreEditModal
          :studentList="studentList"
          :open="showEdit"
          :draft="draft"
          :error-text="editError"
          @close="closeEdit"
          @save="saveEdit"
        />
      </main>
    </div>
  </div>
</template>