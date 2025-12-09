<script setup lang="ts">
const props = defineProps<{
  open: boolean
  draft: {
    id: number
    firstName: string
    lastName: string
    gradeLevel: number | null
    program: string | null
    isArchived: boolean | null
  }
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
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
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
          <!-- First Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              v-model="props.draft.firstName"
              type="text"
              class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              v-model="props.draft.lastName"
              type="text"
              class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
            />
          </div>

          <!-- Grade Level -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Grade Level (numeric)
            </label>
            <input
              v-model.number="props.draft.gradeLevel"
              type="number"
              min="0"
              class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
            />
          </div>

          <!-- Program -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Program
            </label>
            <input
              v-model="props.draft.program"
              type="text"
              class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
            />
          </div>

          <!-- Archived -->
          <div class="flex items-center space-x-2">
            <input
              id="edit-is-archived"
              v-model="props.draft.isArchived"
              type="checkbox"
              class="h-4 w-4 text-[#2e777e] border-gray-300 rounded"
            />
            <label for="edit-is-archived" class="text-sm text-gray-700">
              Archived
            </label>
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
