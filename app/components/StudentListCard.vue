<script setup lang="ts">
import { useStudentListStore } from '~/composables/useStudentListStore'

const { filteredStudents } = useStudentListStore()
</script>


<template>
  <div class="h-full p-4 flex flex-col min-h-0">
    <ul
      class="w-full flex-1 min-h-0 max-h-full overflow-y-auto rounded-md p-2 space-y-2"
      style="scrollbar-gutter: stable;"
    >
      <li
        v-for="s in filteredStudents"
        :key="s.id"
        class="px-4 py-3 border rounded-md bg-white hover:bg-gray-50
               flex items-center justify-between"
      >
        <div class="flex flex-col">
          <div class="font-semibold text-gray-900">
            {{ s.lastName }}, {{ s.firstName }}
          </div>

          <div class="text-xs text-gray-600 mt-0.5">
            <span v-if="s.gradeLevel !== null && s.gradeLevel !== undefined">
              Grade: {{ s.gradeLevel }}
            </span>
            <span v-else>
              Grade: N/A
            </span>
          </div>

          <div class="text-xs text-gray-600 mt-0.5">
            <span v-if="(s.program || '').trim()">
              Program: {{ s.program }}
            </span>
            <span v-else>
              Program: N/A
            </span>
          </div>
        </div>

        <div>
          <span
            v-if="s.isArchived"
            class="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold bg-gray-200 text-gray-700"
          >
            Archived
          </span>
          <span
            v-else
            class="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800"
          >
            Active
          </span>
        </div>
      </li>

      <li
        v-if="filteredStudents.length === 0"
        class="px-4 py-2 text-gray-600 italic bg-white border-2 border-dashed border-gray-300 rounded-md"
      >
        No students found
      </li>
    </ul>
  </div>
</template>
