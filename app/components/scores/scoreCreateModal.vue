<script setup lang="ts">
import type { StudentOption } from '~~/types/studentOption';

    const props = defineProps<{
      open: boolean
      form: {
        student_dibel_score: number |null
        student_dibel_ORF: number | null
        student_dibel_MAZE: number | null
        student_fluency_score: number | null
        student_comprehension_score: number | null
        student_vocab_score: number | null
        student_known_words:string | null
        student_unknown_words: string | null
        selectedStudentId: number | null
      }
      studentList: StudentOption[]
      errors: Record<string, string>
      errorText: string | null
    }>()
    
    const emit = defineEmits<{
        (e: 'close'): void
        (e: 'save'): void
    }>()

    </script>
    
    <template>
      <Teleport to="body">
        <div
          v-if="open"
          class="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
        >
          <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <header class="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 class="text-base font-semibold text-slate-800">
                Add Score
              </h2>
              <button
                type="button"
                class="text-slate-500 hover:text-slate-800"
                @click="emit('close')"
              >
                ✕
              </button>
            </header>
    
            <div class="px-4 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">
                        Select Student
                    </label>
                    <select v-model.number="form.selectedStudentId">
                        <option
                            v-for="s in studentList  || []"
                            :key="s.student_id"
                            :value="s.student_id"
                        >
                            {{ s.student_fname + ' ' + s.student_lname }}
                        </option>
                    </select>
                </div>
                
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">
                    Dibel Score
                  </label>
                  <input
                    v-model.number="form.student_dibel_score"
                    type="number"
                    class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                  />
                </div>
              </div>
    
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">
                    Dibel Maze Score
                  </label>
                  <input
                    v-model.number="form.student_dibel_MAZE"
                    type="number"
                    class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                  />
                </div>
    
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">
                    Dibel ORF Score
                  </label>
                  <input
                    v-model.number="form.student_dibel_ORF"
                    type="number"
                    class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">
                    Comprehension Score
                  </label>
                  <input
                    v-model.number="form.student_comprehension_score"
                    type="number"
                    class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                  />
                </div>
    
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">
                    Vocab Score 
                  </label>
                  <input
                    v-model.number="form.student_vocab_score"
                    type="number"
                    class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">
                    Fluency Score
                  </label>
                  <input
                    v-model.number="form.student_fluency_score"
                    type="number"
                    min="0"
                    class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">
                    Known Words  (Enter words seperated by a comma)
                </label>
                <textarea
                v-model="form.student_known_words"
                rows="3"
                class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                placeholder="Add any of the students kown words..."
                />
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">
                    Unknown Words  (Enter words seperated by a comma)
                </label>
                <textarea
                v-model="form.student_unknown_words"
                rows="3"
                class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                placeholder="Add any of the students unknown words..."
                />
            </div>
            </div>
    
            <footer class="px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                class="px-3 py-1.5 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
                @click="emit('close')"
              >
                Cancel
              </button>
              <button
                type="button"
                class="px-3 py-1.5 text-xs rounded bg-[#2e777e] text-white font-medium hover:bg-[#245e64]"
                @click="emit('save')"
              >
                Save
              </button>
            </footer>
          </div>
        </div>
      </Teleport>
    </template>
    