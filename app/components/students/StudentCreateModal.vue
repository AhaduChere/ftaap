<script setup lang="ts">
const props = defineProps<{
  open: boolean
  form: {
    firstName: string
    lastName: string
    gradeLevel: number | null
    program: string | null
    isArchived: boolean | null
  }
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
            Add Student
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
                First Name
              </label>
              <input
                v-model="form.firstName"
                type="text"
                class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
              />
              <p
                v-if="errors.firstName"
                class="text-xs text-red-600 mt-0.5"
              >
                {{ errors.firstName }}
              </p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">
                Last Name
              </label>
              <input
                v-model="form.lastName"
                type="text"
                class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
              />
              <p
                v-if="errors.lastName"
                class="text-xs text-red-600 mt-0.5"
              >
                {{ errors.lastName }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">
                Grade Level
              </label>
              <input
                v-model.number="form.gradeLevel"
                type="number"
                min="0"
                class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">
                Program
              </label>
              <input
                v-model="form.program"
                type="text"
                class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
              />
            </div>
          </div>

          <div class="flex items-center gap-2 mt-2">
            <input
              id="create-archived"
              v-model="form.isArchived"
              type="checkbox"
              class="w-4 h-4 border-slate-300 rounded"
            />
            <label
              for="create-archived"
              class="text-xs text-slate-700"
            >
              Mark as archived
            </label>
          </div>

          <p
            v-if="errorText"
            class="text-xs text-red-600 mt-2"
          >
            {{ errorText }}
          </p>
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
