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
import ScoresHeader from '~/components/scores/scoresHeader.vue'
import ScoresControls from '~/components/scores/scoresControls.vue'

import ScoreCreateModal from '@/components/scores/scoreCreateModal.vue'
import ScoreEditModal from '@/components/scores/scoreEditModal.vue'
import StudentsTable from '@/components/students/StudentsTable.vue'

// Composable: API + state
const { students, pending, error, refresh, create, replace, remove } = useStudents()

type row = StudentScore & {
        student_full_name: string
    }

/* ---------------------------------------------------------
    Map Students to StudentOption
    --------------------------------------------------------- */
    const studentList = computed<StudentOption[]>(() => {
        return students.value.map((s: Student) => ({
            id: s.id,
            firstName: s.firstName,
            lastName: s.lastName
        }))
    });

const scores = ref<StudentScore[]>([])
const scoresPending = ref(false)
const scoresError = ref<string | null>(null)

async function loadScores(){ 
    scoresPending.value = true;
    scoresError.value = null;

    try {
        const rows = await $fetch<StudentScore[]>('/api/scores/scores')

        if(Array.isArray(rows)){
            scores.value = rows.map((s: StudentScore) => {
                const student = students.value.find(
                st => st.id === s.student_id
                )

                return {
                    ...s,
                    student_full_name: student
                        ? `${student.firstName} ${student.lastName}`
                        : 'Unknown Student'
                }
            });
        }else {
            scores.value = [];
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

    onServerPrefetch(() => refresh())

onMounted(async () => {
  await Promise.all([refresh(), loadScores()])
})

onActivated(() => refresh())

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
    if (!form.selectedStudentId) addErrors.selectedStudent = 'Student is required.'
    return Object.keys(addErrors).length === 0
}

async function add() {
    if (!validateCreate()) return
    createError.value = null

    const payload = { 
        student_id: Number(form.selectedStudentId),

        student_dibel_score:
        form.student_dibel_score != null
            ? Number(form.student_dibel_score)
            : null,

        student_dibel_ORF:
        form.student_dibel_ORF != null
            ? Number(form.student_dibel_ORF)
            : null,

        student_dibel_MAZE:
        form.student_dibel_MAZE != null
            ? Number(form.student_dibel_MAZE)
            : null,

        student_fluency_score:
        form.student_fluency_score != null
            ? Number(form.student_fluency_score)
            : null,

        student_comprehension_score:
        form.student_comprehension_score != null
            ? Number(form.student_comprehension_score)
            : null,

        student_vocab_score:
        form.student_vocab_score != null
            ? Number(form.student_vocab_score)
            : null,

        student_known_words:
        form.student_known_words?.split(',') ?? [],

        student_unknown_words:
        form.student_unknown_words?.split(',') ?? [],

        inserted_date: new Date().toISOString(),

    }

    try {
        const res = await fetch('/api/scores/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

    Object.assign(form, {
        student_dibel_score: null,
        student_dibel_ORF: null,
        student_dibel_MAZE: null,
        student_fluency_score: null,
        student_comprehension_score: null,
        student_vocab_score: null,
        selectedStudentId: null,
    })

    closeCreate()
    } catch (e: error) {
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
    student_dibel_score: null as number | null,
    student_dibel_ORF: null as number | null,
    student_dibel_MAZE: null as number | null,
    student_fluency_score: null as number | null,
    student_comprehension_score: null as number | null,
    student_vocab_score: null as number | null,
    student_known_words: '',
    student_unkown_words: '',
    selectedStudentId: null as number | null,
})

function openEdit(s: StudentScore) {
    editError.value = null

    Object.assign(draft, {
        student_score_id: s.student_score_id,
        student_dibel_score:  s.student_dibel_score !== null && s.student_dibel_score !== undefined ? Number(s.student_dibel_score) : null,
        student_dibel_ORF:  s.student_dibel_ORF !== null && s.student_dibel_ORF !== undefined ? Number(s.student_dibel_ORF) : null,
        student_dibel_MAZE:  s.student_dibel_MAZE !== null && s.student_dibel_MAZE !== undefined ? Number(s.student_dibel_MAZE) : null,
        student_fluency_score:  s.student_fluency_score !== null && s.student_fluency_score !== undefined ? Number(s.student_fluency_score) : null,
        student_comprehension_score:  s.student_comprehension_score !== null && s.student_comprehension_score !== undefined ? Number(s.student_comprehension_score) : null,
        student_vocab_score:  s.student_vocab_score !== null && s.student_vocab_score !== undefined ? Number(s.student_vocab_score) : null,
        student_known_words: s.student_known_words ?? '',
        student_unknown_words: s.student_unknown_words ?? '',
        selectedStudentId: s.student_id
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
        student_id: draft.selectedStudentId
    }
    const res = await fetch('/api/scores/scores', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    loadScores();
    closeEdit();
    } catch (e: error) {
    editError.value = e?.data?.message ?? e?.message ?? 'Failed to save changes.'
    }
}

/* ---------------------------------------------------------
    FILTERS & SORTING
    --------------------------------------------------------- */

const search = ref('') ;

type SortMode = 'dibel_avg_desc' | 'dibel_avg_asc' | 
'fluency_desc' | 'fluency_asc' | 
'comprehension_desc' | 'comprehension_asc' | 
'vocab_desc' | 'vocab_asc';
const sortMode = ref<SortMode>('');

function computeDibelAvg(dibel:number, MAZE:number, ORF:number){
    return (dibel + MAZE + ORF) / 3
}

const visibleScores = computed(() => {
    const q = search.value.trim().toLowerCase()
    let base = scores.value.filter((s:row) => {
        const fullName = s.student_full_name.toLowerCase()
        const matchesQ =
        !q ||
        fullName.includes(q);

        return matchesQ
    });

    base.sort((a: StudentScore, b: StudentScore) =>
      a.student_full_name.localeCompare(b.student_full_name),
    )

    if (sortMode.value === 'dibel_avg_desc') {
        base.sort(
            (a: StudentScore, b: StudentScore) =>
            (computeDibelAvg(b.student_dibel_score, b.student_dibel_MAZE, b.student_dibel_ORF) ?? Number.NEGATIVE_INFINITY) - (computeDibelAvg(a.student_dibel_score, a.student_dibel_MAZE, a.student_dibel_ORF) ?? Number.NEGATIVE_INFINITY),
        )
    } else if (sortMode.value === 'dibel_avg_asc') {
        base.sort(
            (a: StudentScore, b: StudentScore) =>
            (computeDibelAvg(a.student_dibel_score, a.student_dibel_MAZE, a.student_dibel_ORF) ?? Number.POSITIVE_INFINITY) - (computeDibelAvg(b.student_dibel_score, b.student_dibel_MAZE, b.student_dibel_ORF) ?? Number.POSITIVE_INFINITY),
        )
    } else if (sortMode.value === 'fluency_desc') {
        base.sort(
            (a: StudentScore, b: StudentScore) =>
            ((b.student_fluency_score ?? Number.NEGATIVE_INFINITY) - (a.student_fluency_score ?? Number.NEGATIVE_INFINITY)),
        )
    } else if (sortMode.value === 'fluency_asc') {
        base.sort(
            (a: StudentScore, b: StudentScore) =>
            ((a.student_fluency_score ?? Number.POSITIVE_INFINITY) - (b.student_fluency_score ?? Number.POSITIVE_INFINITY)),
        )
    }else if (sortMode.value === 'comprehension_desc') {
        base.sort(
            (a: StudentScore, b: StudentScore) =>
            ((b.student_comprehension_score ?? Number.NEGATIVE_INFINITY) - (a.student_comprehension_score ?? Number.NEGATIVE_INFINITY)),
        )
    } else if (sortMode.value === 'comprehension_asc') {
        base.sort(
            (a: StudentScore, b: StudentScore) =>
            ((a.student_comprehension_score ?? Number.POSITIVE_INFINITY) - (b.student_comprehension_score ?? Number.POSITIVE_INFINITY)),
        )
    }else if (sortMode.value === 'vocab_desc') {
        base.sort(
            (a: StudentScore, b: StudentScore) =>
            ((b.student_vocab_score ?? Number.NEGATIVE_INFINITY) - (a.student_vocab_score ?? Number.NEGATIVE_INFINITY)),
        )
    } else if (sortMode.value === 'vocab_asc') {
        base.sort(
            (a: StudentScore, b: StudentScore) =>
            ((a.student_vocab_score ?? Number.POSITIVE_INFINITY) - (b.student_vocab_score ?? Number.POSITIVE_INFINITY)),
        )
    }

    return base;
})
</script>
    
<template>
    <div class="min-h-screen bg-gradient-to-b from-[#f7feff] to-slate-100">
    <div class="pt-32"></div>

    <main class="max-w-6xl mx-auto px-4 pb-10 space-y-6">
        <section class="max-h-[35rem] w-full bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-scroll">
        <ScoresHeader @add="openCreate"/>
        <div class="border-t border-slate-200">
            <div class="px-4 py-3 bg-slate-50/80 border-b border-slate-200">
            <ScoresControls
                v-model:search="search"
                v-model:sortMode="sortMode"
            />

            <p v-if="scoresError" class="mt-2 text-xs text-red-600">
                {{ scoresError }}
            </p>
            </div>

            <div class="p-4 overflow-x-auto bg-white">
            <div v-if="scoresPending" class="py-8 text-center text-sm text-slate-500">
                Loading students scores…
            </div>

            <div
                v-else-if="error"
                class="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
                {{ error }}
            </div>

            <div v-else>
                <ScoresTable :rows="visibleScores" @edit="openEdit"/>

                <p
                v-if="!scoresPending && !scoresError && scores.length === 0"
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
</template>
    