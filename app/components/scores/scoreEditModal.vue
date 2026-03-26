<script setup lang="ts">
import type { StudentOption } from '~~/types/studentOption';

    const props = defineProps<{
      open: boolean
      draft: {
        student_score_id: number | null,
        student_dibel_score: number | null
        student_dibel_ORF: number | null
        student_dibel_MAZE: number | null
        student_fluency_score: number | null
        student_comprehension_score: number | null
        student_vocab_score: number | null
        student_known_words:string
        student_unknown_words: string
        selectedStudentId: number | null
      }
      studentList: StudentOption[]
      errorText?: string | null
    }>()
    
    const emit = defineEmits<{
      (e: 'close'): void
      (e: 'save'): void
    }>()
    </script>
    
    <template>
      <transition name="fade">
        <div
          v-if="props.open"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <div class="overflow-scroll max-h-[38rem] bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
            <!-- Header -->
            <div class="px-6 py-4 border-b flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">
                Edit Student
              </h2>
              <button
                type="button"
                class="text-gray-500 hover:text-gray-700"
                @click="emit('close')"
              >
                ✕
              </button>
            </div>
    
            <!-- Body -->
            <div class="px-6 py-4 space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">
                        Select Student
                    </label>
                    <select v-model.number="draft.selectedStudentId">
                        <option
                            v-for="s in studentList  || []"
                            :key="s.student_id"
                            :value="s.student_id"
                        >
                            {{ s.student_fname + ' ' + s.student_lname }}
                        </option>
                    </select>
                </div>
              <!-- First Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Dibel Score
                </label>
                <input
                  v-model.number="draft.student_dibel_score"
                  type="number"
                  class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                />
              </div>
    
              <!-- Last Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Dibel Maze Score
                </label>
                <input
                  v-model.number="draft.student_dibel_MAZE"
                  type="number"
                  class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                />
              </div>
    
              <!-- Grade Level -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Dibel ORF Score
                </label>
                <input
                  v-model.number="draft.student_dibel_ORF"
                  type="number"
                  min="0"
                  class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                />
              </div>
    
              <!-- Program -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Comprehension Score
                </label>
                <input
                  v-model.number="draft.student_comprehension_score"
                  type="number"
                  class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Vocab Score
                </label>
                <input
                  v-model.number="draft.student_vocab_score"
                  type="number"
                  class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Fluency Score
                </label>
                <input
                  v-model.number="draft.student_fluency_score"
                  type="number"
                  class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                    Known Words (Enter words seperated by a comma)
                </label>
                <textarea
                v-model="draft.student_known_words"
                rows="3"
                class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                placeholder="Add any of the students kown words..."
                />
            </div>

            <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                    Unknown Words (Enter words seperated by a comma)
                </label>
                <textarea
                v-model="draft.student_unknown_words"
                rows="3"
                class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                placeholder="Add any of the students unknown words..."
                />
            </div>
    
              <!-- Error text -->
              <p
                v-if="props.errorText"
                class="text-red-600 text-sm mt-2"
              >
                {{ props.errorText }}
              </p>
            </div>
    
            <!-- Footer -->
            <div class="px-6 py-3 border-t flex justify-end space-x-2">
              <button
                type="button"
                class="px-4 py-2 border rounded text-sm text-gray-700 hover:bg-gray-50"
                @click="emit('close')"
              >
                Cancel
              </button>
              <button
                type="button"
                class="px-4 py-2 rounded text-sm text-white bg-[#2e777e] hover:bg-[#255f64]"
                @click="emit('save')"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </transition>
    </template>
    
    <style scoped>
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.15s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
    </style>
    