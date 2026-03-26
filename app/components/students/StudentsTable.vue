<script setup lang="ts">
import type { Student } from '~~/types/student'

const props = defineProps<{
  rows: Student[]
}>()

const emit = defineEmits<{
  (e: 'edit', row: Student): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <div class="w-full h-full min-h-0">
    <div class="table-scroll max-h-[520px] overflow-y-auto overflow-x-auto border border-slate-200 rounded-lg bg-white">
      <table class="min-w-full text-sm border-collapse">
        <thead class="bg-slate-50 text-slate-700 sticky top-0">
          <tr class="text-left">
            <th class="px-3 py-2 font-semibold">Student</th>
            <th class="px-3 py-2 font-semibold">Grade</th>
            <th class="px-3 py-2 font-semibold">Program</th>
            <th class="px-3 py-2 font-semibold">Organization</th>
            <th class="px-3 py-2 font-semibold text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-200 bg-white">
          <tr
            v-for="row in rows"
            :key="row.student_id"
            class="hover:bg-slate-50/60"
          >
            <td class="px-3 py-2">
              <div class="font-medium text-slate-800">
                {{ row.student_lname }}, {{ row.student_fname }}
              </div>
              <div
                v-if="row.is_archived"
                class="text-xs text-slate-500 italic"
              >
                Archived
              </div>
            </td>

            <td class="px-3 py-2 text-slate-700">
              {{ row.student_grade_level ?? '—' }}
            </td>

            <td class="px-3 py-2 text-slate-700">
              {{ row.student_program ?? '—' }}
            </td>

            <td class="px-3 py-2 text-slate-700">
              {{ row.organization ?? '—' }}
            </td>

            <td class="px-3 py-2">
              <div class="flex justify-end gap-2">
                <button
                  type="button"
                  class="px-2 py-1 rounded border border-slate-300 text-xs text-slate-700 hover:bg-slate-100"
                  @click="emit('edit', row)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="px-2 py-1 rounded border border-red-200 bg-red-50 text-xs text-red-700 hover:bg-red-100"
                  @click="emit('delete', Number(row.student_id))"
                >
                  Archive
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td
              colspan="5"
              class="text-center py-6 text-xs text-slate-500 italic"
            >
              No students to display.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-scroll {
  scrollbar-width: thin;
  scrollbar-color: #2e777e #f1f5f9;
}

.table-scroll::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.table-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 9999px;
}

.table-scroll::-webkit-scrollbar-thumb {
  background: #2e777e;
  border-radius: 9999px;
  border: 2px solid #f1f5f9;
}

.table-scroll::-webkit-scrollbar-thumb:hover {
  background: #245e64;
}

.table-scroll::-webkit-scrollbar-corner {
  background: #f1f5f9;
}
</style>