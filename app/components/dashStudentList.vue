<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useStudents } from '~/composables/useStudents';
import type { StudentScore } from '~~/types/studentScore';
import type { Student } from '~~/types/student';
const route = useRoute();
const selectedTeacherId = ref(null);

const { students, pending, error, refresh } = useStudents();

const { $supabase } = useNuxtApp();
const supabase = $supabase as SupabaseClient;

type ScoreRow = StudentScore & { student_full_name: string };

const scores = ref<ScoreRow[]>([]);
const scoresPending = ref(false);
const scoresError = ref<string | null>(null);

const studentMap = computed(() => Object.fromEntries(students.value.map((s) => [s.student_id, s])));

async function loadScores() {
  scoresPending.value = true;
  scoresError.value = null;
  try {
    const rows = await $fetch<StudentScore[]>('/api/scores/scores');
    if (Array.isArray(rows) && students.value.length) {
      // Keep only the most recent score per student
      const latestMap = new Map<number, StudentScore>();
      for (const row of rows) {
        const existing = latestMap.get(row.student_id);
        if (!existing || new Date(row.inserted_date) > new Date(existing.inserted_date)) {
          latestMap.set(row.student_id, row);
        }
      }

      scores.value = Array.from(latestMap.values())
        .map((s): ScoreRow | null => {
          const student = studentMap.value[s.student_id];
          if (!student) return null;

          const dibel = s.student_dibel_score ?? 0;
          const orf = s.student_dibel_ORF ?? 0;
          const maze = s.student_dibel_MAZE ?? 0;
          const avg = Math.round((dibel + orf + maze) / 3);

          return {
            ...s,
            student_dibel_score: avg,
            student_full_name: `${student.student_fname} ${student.student_lname}`,
          };
        })
        .filter((r): r is ScoreRow => r !== null);
    } else {
      scores.value = [];
    }
  } catch (e: any) {
    scoresError.value = e?.data?.message ?? e?.message ?? 'Failed to load scores.';
    scores.value = [];
  } finally {
    scoresPending.value = false;
  }
}

onMounted(async () => {
  const { data: userData } = await supabase.auth.getUser();
  const teacherId = userData?.user?.id;
  const adminCheck = await $fetch('/api/admin', {
    method: 'POST',
    body: {
      userId: userData.user.id,
    },
  });
  if (adminCheck) {
    selectedTeacherId.value = route.params.id ? Number(route.params.id) : null;
    const id = selectedTeacherId.value;
    const data = await $fetch(`/api/teacher/${id}`);
    if (data.success) {
      await refresh(data.TeacherInfo.user_id);
      await loadScores();
      return;
    }
  } else if (teacherId) {
    // await refresh(teacherId);
    // await loadScores();
  }
});

// Search / sort / filter state
const search = ref('');
const sort = ref<'A - Z' | 'By color'>('A - Z');
const tier = ref<'All' | 'Strong' | 'Danger' | 'Struggling'>('All');

// Maps score to tier: green=strong, yellow=danger, red=struggling
function colorTier(score: number | null): 'Strong' | 'Danger' | 'Struggling' {
  if (score == null || score < 5) return 'Struggling';
  if (score < 10) return 'Danger';
  return 'Strong';
}

// For sorting: green first, then yellow, then red
const tierOrder = { Strong: 0, Danger: 1, Struggling: 2 };

const filteredScores = computed(() => {
  let list = [...scores.value];

  // Search
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter((s) => s.student_full_name.toLowerCase().includes(q));
  }

  // Tier filter
  if (tier.value !== 'All') {
    list = list.filter((s) => colorTier(s.student_dibel_score) === tier.value);
  }

  // Sort
  if (sort.value === 'A - Z') {
    list.sort((a, b) => a.student_full_name.localeCompare(b.student_full_name));
  } else if (sort.value === 'By color') {
    list.sort((a, b) => tierOrder[colorTier(a.student_dibel_score)] - tierOrder[colorTier(b.student_dibel_score)]);
  }

  return list;
});
</script>

<template>
  <div
    class="w-full h-full bg-gradient-to-b from-[#3b797e] to-[#81b6bb] border border-[#2e777e] drop-shadow-lg rounded-lg overflow-hidden flex flex-col">
    <!-- Header with controls -->
    <DashStudentHeader v-model:search="search" v-model:sort="sort" v-model:tier="tier" />

    <!-- Loading state -->
    <div v-if="pending || scoresPending" class="flex-1 flex items-center justify-center bg-white text-gray-500 py-8">Loading students…</div>

    <!-- Error state -->
    <div v-else-if="error || scoresError" class="flex-1 flex items-center justify-center bg-white text-red-500 py-8">
      {{ error ?? scoresError }}
    </div>

    <!-- Student list -->
    <div v-else class="flex-1 min-h-0 bg-white">
      <StudentListCard :rows="filteredScores" />
    </div>
  </div>
</template>
