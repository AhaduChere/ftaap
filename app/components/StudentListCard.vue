<script setup lang="ts">
import type { StudentScore } from '~~/types/studentScore'

type ScoreRow = StudentScore & { student_full_name: string }

const props = defineProps<{
  rows: ScoreRow[]
}>()
</script>

<template>
  <div class="flex flex-col h-full min-h-0">
    <!-- Column headers -->
    <div class="grid grid-cols-2 px-4 py-2 bg-slate-100 border-b-2 border-[#2e777e] text-sm font-semibold text-slate-700 shrink-0">
      <span>Student Name</span>
      <span class="text-right">Dibel Score</span>
    </div>

    <!-- Scrollable rows -->
    <div class="flex-1 min-h-0 overflow-y-auto" style="scrollbar-gutter: stable;">
      <NuxtLink
        v-for="r in rows"
        :key="r.student_id"
        :to="`/progressReport/${r.student_id}`"
        class="grid grid-cols-2 px-4 py-3 border-b border-slate-200 bg-white hover:bg-[#f0fafb] transition-colors duration-150"
      >
        <span class="font-medium text-slate-800">{{ r.student_full_name }}</span>
        <span
          class="text-right font-semibold"
          :class="{
            'text-slate-400':  r.student_dibel_score == null,
            'text-red-500':    r.student_dibel_score != null && r.student_dibel_score < 5,
            'text-yellow-500': r.student_dibel_score != null && r.student_dibel_score >= 5 && r.student_dibel_score < 10,
            'text-green-500':  r.student_dibel_score != null && r.student_dibel_score >= 10
          }"
        >{{ r.student_dibel_score ?? 'N/A' }}</span>
      </NuxtLink>

      <div
        v-if="rows.length === 0"
        class="px-4 py-4 text-center text-gray-500 italic"
      >
        No students found
      </div>
    </div>
  </div>
</template>