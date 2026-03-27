// StudentEditModal.vue
// Modal component for editing an existing student.
// This component handles:
// - displaying the edit student form
// - binding input fields to the student draft data
// - program autocomplete dropdown
// - organization selection
// - emitting save and close events


<script setup lang="ts">
import { ref, watch, computed } from 'vue'

// Props passed into the modal component
const props = defineProps<{
  open: boolean // controls whether modal is visible
  draft: { // editable student data (two-way bound)
    student_id: number
    student_fname: string
    student_lname: string
    student_grade_level: number | null
    student_program: string | null
    organization_id: number | null
    student_notes: string | null
    is_archived: boolean | null
  }
  organizations: { id: number; organization_name: string }[] // dropdown options
  programOptions: string[] // autocomplete program options
  errorText: string | null // general error message
}>()

// Events emitted to parent
const emit = defineEmits<{
  (e: 'close'): void // close modal
  (e: 'save'): void // save changes
}>()

/* -------------------------
   Autocomplete logic
------------------------- */

// Tracks current input in program field
const programQuery = ref('')

// Controls dropdown visibility
const showDropdown = ref(false)

// Hides dropdown slightly delayed (so click can register)
function hideDropdown() {
  setTimeout(() => {
    showDropdown.value = false
  }, 100)
}

// When modal opens, initialize program input with existing value
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    programQuery.value = props.draft.student_program ?? ''
    showDropdown.value = false
  },
  { immediate: true },
)

// Filters program list based on user input
const filteredPrograms = computed(() => {
  const q = programQuery.value.trim().toLowerCase()
  if (!q) return props.programOptions

  return props.programOptions.filter((p) =>
    p.toLowerCase().includes(q),
  )
})

// Syncs input field back to draft data
watch(programQuery, (val) => {
  props.draft.student_program = val
})

// Handles selecting a program from dropdown
function selectProgram(program: string) {
  programQuery.value = program
  props.draft.student_program = program
  showDropdown.value = false
}
</script>

<template>
  <!-- Teleport ensures modal renders at root of body -->
  <Teleport to="body">
    <!-- Modal overlay -->
    <div
      v-if="open"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
    >
      <!-- Modal container -->
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <!-- Header -->
        <header class="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-800">
            Edit Student
          </h2>
          <!-- Close button -->
          <button
            type="button"
            class="text-slate-500 hover:text-slate-800"
            @click="emit('close')"
          >
            ✕
          </button>
        </header>

        <!-- Body -->
        <div class="px-4 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
          <!-- Name inputs -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">
                First Name
              </label>
              <!-- First name input -->
              <input
                v-model="draft.student_fname"
                type="text"
                class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">
                Last Name
              </label>
              <!-- Last name input -->
              <input
                v-model="draft.student_lname"
                type="text"
                class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
              />
            </div>
          </div>

          <!-- Grade and program section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">
                Grade Level
              </label>
              <!-- Grade input -->
              <input
                v-model.number="draft.student_grade_level"
                type="number"
                min="1"
                class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
              />
            </div>

            <!-- Program autocomplete -->
            <div class="relative">
              <label class="block text-xs font-semibold text-slate-600 mb-1">
                Program
              </label>

              <!-- Program input -->
              <input
                v-model="programQuery"
                type="text"
                placeholder="Type a program..."
                class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
                @focus="showDropdown = true"
                @blur="hideDropdown"
              />

              <!-- Program dropdown list -->
              <ul
                v-if="showDropdown && filteredPrograms.length"
                class="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-slate-300 bg-white shadow-lg"
              >
                <li
                  v-for="program in filteredPrograms"
                  :key="program"
                  class="cursor-pointer px-3 py-2 text-sm border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                  @mousedown.prevent="selectProgram(program)"
                >
                  {{ program }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Organization dropdown -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">
              Organization
            </label>

            <select
              v-model="draft.organization_id"
              class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
            >
              <!-- Placeholder -->
              <option :value="null" disabled>
                Select an organization…
              </option>

              <!-- Organization options -->
              <option
                v-for="org in organizations"
                :key="org.id"
                :value="org.id"
              >
                {{ org.organization_name }}
              </option>
            </select>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">
              Notes (optional)
            </label>
            <textarea
              v-model="draft.student_notes"
              rows="3"
              class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
              placeholder="Add any helpful notes about this student…"
            />
          </div>

          <!-- General error -->
          <p
            v-if="errorText"
            class="text-xs text-red-600 mt-2"
          >
            {{ errorText }}
          </p>
        </div>

        <!-- Footer -->
        <footer class="px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
          <!-- Cancel button -->
          <button
            type="button"
            class="px-3 py-1.5 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
            @click="emit('close')"
          >
            Cancel
          </button>
          <!-- Save button -->
          <button
            type="button"
            class="px-3 py-1.5 text-xs rounded bg-[#2e777e] text-white font-medium hover:bg-[#245e64]"
            @click="emit('save')"
          >
            Save Changes
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>