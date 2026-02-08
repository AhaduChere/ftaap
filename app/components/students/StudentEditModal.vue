<script setup lang="ts">
type OrganizationOption = {
  id: number
  organization_name: string
}

const props = defineProps<{
  open: boolean
  draft: {
    id: number
    firstName: string
    lastName: string
    gradeLevel: number | null
    program: string | null

    //  allow editing org
    organizationId: number | null

    isArchived: boolean | null
  }

  // options passed from manageStudents page
  organizations: OrganizationOption[]

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

          <!-- ✅ NEW: Organization -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Organization
            </label>

            <select
              v-model="props.draft.organizationId"
              class="w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
            >
              <option :value="null" disabled>
                Select an organization…
              </option>

              <option
                v-for="org in props.organizations"
                :key="org.id"
                :value="org.id"
              >
                {{ org.organization_name }}
              </option>
            </select>
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
