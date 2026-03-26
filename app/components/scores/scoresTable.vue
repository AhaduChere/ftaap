<script setup lang="ts">
import type { StudentScore } from '~~/types/studentScore'

type row = StudentScore & {
  student_full_name: string
}

defineProps<{
  rows: row[]
}>()

const emit = defineEmits<{
  (e: 'edit', row: row): void
}>()
</script>

<template>
  <div class="w-full h-full min-h-0">
    <!-- ✅ SCROLLBAR HERE -->
    <div
      class="table-scroll h-full min-h-0 overflow-y-auto overflow-x-auto border border-slate-200 rounded-lg bg-white"
    >
      <table class="min-w-full text-sm border-collapse">
        <!-- STICKY HEADER -->
        <thead class="bg-slate-50 text-slate-700 sticky top-0">
          <tr class="text-left">
            <th class="px-3 py-2 font-semibold">Student</th>
            <th class="px-3 py-2 font-semibold">Dibel Score</th>
            <th class="px-3 py-2 font-semibold">Dibel ORF Score</th>
            <th class="px-3 py-2 font-semibold">Dibel MAZE Score</th>
            <th class="px-3 py-2 font-semibold">Fluency Score</th>
            <th class="px-3 py-2 font-semibold">Comprehension Score</th>
            <th class="px-3 py-2 font-semibold">Vocabulary Score</th>
            <th class="px-3 py-2 font-semibold text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-200 bg-white">
          <tr
            v-for="row in rows"
            :key="row.student_score_id"
            class="hover:bg-slate-50/60"
          >
            <td class="px-3 py-2 text-slate-700">
              {{ row.student_full_name ?? '—' }}
            </td>

            <td class="px-3 py-2 font-medium text-slate-800">
              {{ row.student_dibel_score }}
            </td>

            <td class="px-3 py-2 text-slate-700">
              {{ row.student_dibel_ORF ?? '—' }}
            </td>

            <td class="px-3 py-2 text-slate-700">
              {{ row.student_dibel_MAZE ?? '—' }}
            </td>

            <td class="px-3 py-2 text-slate-700">
              {{ row.student_fluency_score ?? '—' }}
            </td>

            <td class="px-3 py-2 text-slate-700">
              {{ row.student_comprehension_score ?? '—' }}
            </td>

            <td class="px-3 py-2 text-slate-700">
              {{ row.student_vocab_score ?? '—' }}
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
              </div>
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td colspan="8" class="text-center py-6 text-xs text-slate-500 italic">
              No student scores to display.
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
}

.table-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.table-scroll::-webkit-scrollbar-thumb {
  background: #2e777e;
  border-radius: 9999px;
  border: 2px solid #f1f5f9;
}

.table-scroll::-webkit-scrollbar-thumb:hover {
  background: #245e64;
}
</style>