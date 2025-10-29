<script setup lang="ts">
const props = defineProps<{
  open: boolean
  draft: {
    id: number
    firstName: string
    lastName: string
    grade: string
    attendancePct: number | string
    teacher: string
    email: string
    dibelsScore: number | string
  }
  errorText?: string | null
}>()

const emit = defineEmits<{ (e: 'close'): void; (e: 'save'): void }>()
</script>

<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center" @click.self="emit('close')">
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="relative w-[95%] max-w-2xl bg-white border border-[#2e777e] rounded-md p-6 z-10">
        <h2 class="text-lg font-semibold mb-4 text-center text-[#2e777e]">Edit Student</h2>

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
            <input v-model="props.draft.firstName" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
            <input v-model="props.draft.lastName" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Grade</label>
            <input v-model="props.draft.grade" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Teacher</label>
            <input v-model="props.draft.teacher" class="w-full border p-2 rounded" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input v-model="props.draft.email" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Attendance</label>
            <input v-model.number="props.draft.attendancePct" type="number" min="0" max="100" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">DIBELS Score</label>
            <input v-model.number="props.draft.dibelsScore" type="number" min="0" max="500" class="w-full border p-2 rounded" />
          </div>
        </div>

        <div class="flex gap-3 mt-6 justify-center">
          <button @click="emit('save')" class="px-4 py-2 bg-[#2e777e] text-white rounded">Save</button>
          <button @click="emit('close')" class="px-4 py-2 border rounded">Cancel</button>
        </div>
        <p v-if="props.errorText" class="text-red-600 text-center mt-2">{{ props.errorText }}</p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
