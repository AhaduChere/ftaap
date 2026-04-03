<script setup lang="ts">
import type { StudentScore } from '~~/types/studentScore';
    type row = StudentScore & {
        student_full_name: string
    }
    const props = defineProps<{
      rows: row[]
      sortMode: string
    }>()
    const emit = defineEmits<{
      (e: 'edit', row: row): void
      (e: 'delete', id: number): void
      (e: 'update:sortMode', v: string): void
    }>()

    function toggle(field: string): string {
      if (props.sortMode === `${field}_desc`) return `${field}_asc`
      return `${field}_desc`
    }
    </script>
    <template>
      <div class="w-full overflow-scroll">
        <table class="min-w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
          <thead class="bg-slate-50 text-slate-700">
            <tr class="text-left">
              <th class="px-3 py-2 font-semibold">Student</th>
              <th class="px-3 py-2 font-semibold hover:cursor-pointer" title="Sort on Date" @click="emit('update:sortMode', toggle('date'))">Created Date</th>
              <th class="px-3 py-2 font-semibold hover:cursor-pointer" title="Sort on Dibel Avg" @click="emit('update:sortMode', toggle('dibel_avg'))">Dibel Score</th>
              <th class="px-3 py-2 font-semibold hover:cursor-pointer" title="Sort on Dibel Avg" @click="emit('update:sortMode', toggle('dibel_avg'))">Dibel ORF Score</th>
              <th class="px-3 py-2 font-semibold hover:cursor-pointer" title="Sort on Dibel Avg" @click="emit('update:sortMode', toggle('dibel_avg'))">Dibel MAZE Score</th>
              <th class="px-3 py-2 font-semibold hover:cursor-pointer" title="Sort on Fluency" @click="emit('update:sortMode', toggle('fluency'))">Fluency Score</th>
              <th class="px-3 py-2 font-semibold hover:cursor-pointer" title="Sort on Comprehension" @click="emit('update:sortMode', toggle('comprehension'))">Comprehension Score</th>
              <th class="px-3 py-2 font-semibold hover:cursor-pointer" title="Sort on Vocab" @click="emit('update:sortMode', toggle('vocab'))">Vocabulary Score</th>
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
                  {{ row.inserted_date }}
                </div>
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

          <tr v-if="rows.length === 0">
            <td colspan="8" class="text-center py-6 text-xs text-slate-500 italic">
              No student scores to display.
            </td>
          </tr>
        </tbody>
      </table>
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