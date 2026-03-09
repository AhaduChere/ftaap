<script setup lang="ts">
import type { StudentScore } from '~~/types/studentScore';

    type row = StudentScore & {
        student_full_name: string
    }
    const props = defineProps<{
      rows: row[]
    }>()
    const emit = defineEmits<{
      (e: 'edit', row: row): void
      (e: 'delete', id: number): void
    }>()
    </script>
    
    <template>
      <div class="w-full overflow-scroll">
        <table class="min-w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
          <thead class="bg-slate-50 text-slate-700">
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
            <tr v-for="row in rows" :key="row.student_score_id" class="hover:bg-slate-50/60">
             <td class="px-3 py-2 text-slate-700">
                {{ row.student_full_name ?? '—' }}
              </td>
              <td class="px-3 py-2">
                <div class="font-medium text-slate-800">
                  {{ row.student_dibel_score }}
                </div>
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
          </tbody>
        </table>
      </div>
    </template>
    