<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useStudents } from '~/composables/useStudents'
import type { StudentScore } from '~~/types/studentScore'

const { students, pending, error, refresh } = useStudents()

const { $supabase } = useNuxtApp()
const supabase = $supabase as SupabaseClient

type ScoreRow = StudentScore & { student_full_name: string }

const scores = ref<ScoreRow[]>([])
const scoresPending = ref(false)
const scoresError = ref<string | null>(null)

const studentMap = computed(() =>
  Object.fromEntries(students.value.map(s => [s.student_id, s]))
)

async function loadScores() {
  scoresPending.value = true
  scoresError.value = null
  try {
    const rows = await $fetch<StudentScore[]>('/api/scores/scores')

    // Build a map of most recent score per student
    const latestMap = new Map<number, StudentScore>()
    if (Array.isArray(rows)) {
      for (const row of rows) {
        const existing = latestMap.get(row.student_id)
        if (!existing || new Date(row.inserted_date) > new Date(existing.inserted_date)) {
          latestMap.set(row.student_id, row)
        }
      }
    }

    // Build from students.value so unscored students still appear
    scores.value = students.value.map((student): ScoreRow => {
      const s = latestMap.get(student.student_id)
      const full_name = `${student.student_lname}, ${student.student_fname}`

      if (!s) {
        // No score for this student — null dibel_score so StudentListCard shows N/A
        return {
          student_score_id: null,
          student_id: student.student_id,
          student_dibel_score: null,
          student_dibel_ORF: null,
          student_dibel_MAZE: null,
          student_fluency_score: null,
          student_comprehension_score: null,
          student_vocab_score: null,
          inserted_date: null,
          student_known_words: null,
          student_unknown_words: null,
          student_full_name: full_name,
        } as unknown as ScoreRow
      }

      const dibel = s.student_dibel_score ?? 0
      const orf   = s.student_dibel_ORF   ?? 0
      const maze  = s.student_dibel_MAZE  ?? 0
      const avg   = Math.round((dibel + orf + maze) / 3)

      return {
        ...s,
        student_dibel_score: avg,
        student_full_name: full_name,
      }
    })
  } catch (e: any) {
    scoresError.value = e?.data?.message ?? e?.message ?? 'Failed to load scores.'
    scores.value = []
  } finally {
    scoresPending.value = false
  }
}

onMounted(async () => {
  const { data: userData } = await supabase.auth.getUser()
  const teacherId = userData?.user?.id
  if (teacherId) {
    await refresh(teacherId)
    await loadScores()
  }
})

const search = ref('')
const sort = ref<'A - Z' | 'By color'>('A - Z')
const tier = ref<'All' | 'Strong' | 'Danger' | 'Struggling'>('All')

function colorTier(score: number | null): 'Strong' | 'Danger' | 'Struggling' {
  if (score == null || score < 5) return 'Struggling'
  if (score < 10) return 'Danger'
  return 'Strong'
}

const tierOrder = { Strong: 0, Danger: 1, Struggling: 2 }

const filteredScores = computed(() => {
  let list = [...scores.value]

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(s => s.student_full_name.toLowerCase().includes(q))
  }

  if (tier.value !== 'All') {
    list = list.filter(s => colorTier(s.student_dibel_score) === tier.value)
  }

  if (sort.value === 'A - Z') {
    list.sort((a, b) => a.student_full_name.localeCompare(b.student_full_name))
  } else if (sort.value === 'By color') {
    list.sort((a, b) =>
      tierOrder[colorTier(a.student_dibel_score)] - tierOrder[colorTier(b.student_dibel_score)]
    )
  }

  return list
})
</script>

<template>
  <div class="w-full h-full bg-gradient-to-b from-[#3b797e] to-[#81b6bb] border border-[#2e777e] drop-shadow-lg rounded-lg overflow-hidden flex flex-col">
    <DashStudentHeader
      v-model:search="search"
      v-model:sort="sort"
      v-model:tier="tier"
    />

    <div v-if="pending || scoresPending" class="flex-1 flex items-center justify-center bg-white text-gray-500 py-8">
      Loading students…
    </div>

    <div v-else-if="error || scoresError" class="flex-1 flex items-center justify-center bg-white text-red-500 py-8">
      {{ error ?? scoresError }}
    </div>

    <div v-else class="flex-1 min-h-0 bg-white">
      <StudentListCard :rows="filteredScores" />
    </div>
  </div>
</template>