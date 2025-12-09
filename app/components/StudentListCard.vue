<script setup lang="ts">
import { filteredStudents, scoreBorderClass, flagFillClass } from '~/composables/useStudentListStore';
</script>

<template>
  <div class="h-full p-4 flex flex-col min-h-0">
    <ul class="w-full flex-1 min-h-0 max-h-full overflow-y-auto rounded-md p-2 space-y-2" style="scrollbar-gutter: stable;">
      <li
        v-for="s in filteredStudents"
        :key="s.id"
        class="px-4 py-3 border-2 rounded-md bg-white hover:bg-gray-50 flex items-center justify-between"
        :class="scoreBorderClass()"
      >
        <div>
          <div class="font-semibold">{{ s.name }}</div>
          <div class="text-sm text-gray-600">Score: {{ s.score }}</div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" :class="flagFillClass(s.score)">
          <path d="M5 3v18h2v-6h9l-1.5-4L16 7H7V3H5Z" />
        </svg>
      </li>
      <li v-if="filteredStudents.length === 0" class="px-4 py-2 text-gray-600 italic bg-white border-2 border-dashed border-gray-300 rounded-md">
        No students found
      </li>
    </ul>
  </div>
</template>
