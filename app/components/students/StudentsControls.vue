// StudentsControls.vue
// Filter and sorting controls for the student list.
// This component handles:
// - search input for filtering students
// - sorting selection (name, grade ascending/descending)
// - filtering by grade, program, and organization
// - emitting updates to parent component state

<script setup lang="ts">

// Props passed into the component
// These represent the current filter/sort state and available dropdown options
const props = defineProps<{
  search: string // current search query
  sortMode: string // current sorting mode
  gradeFilter: string // selected grade filter
  programFilter: string // selected program filter
  organizationFilter: string // selected organization filter
  grades: string[] // available grade options
  programs: string[] // available program options
  organizations: string[] // available organization options
}>()

// Events emitted to parent component to update state
// Each corresponds to a v-model style update for a specific filter/sort field
const emit = defineEmits<{
  (e: 'update:search', v: string): void // update search input
  (e: 'update:sortMode', v: string): void // update sorting selection
  (e: 'update:gradeFilter', v: string): void // update grade filter
  (e: 'update:programFilter', v: string): void // update program filter
  (e: 'update:organizationFilter', v: string): void // update organization filter
}>()

</script>

<template>
  <!-- Container holding all control elements -->
  <div class="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">

    <!-- Search -->
    <div class="flex flex-col">
      <label class="text-xs font-semibold text-slate-600 mb-1">
        Search
      </label>
      <!-- Text input used to filter students by name, program, organization, or grade -->
      <input
        :value="search"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Name, program, organization, grade…"
        class="w-64 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
      />
    </div>

    <!-- Grade -->
    <div class="flex flex-col">
      <label class="text-xs font-semibold text-slate-600 mb-1">
        Grade
      </label>
      <!-- Dropdown for filtering students by grade -->
      <select
        :value="gradeFilter"
        @change="emit('update:gradeFilter', ($event.target as HTMLSelectElement).value)"
        class="w-28 rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
      >
        <!-- Dynamically render grade options -->
        <option v-for="g in grades" :key="g" :value="g">
          {{ g }}
        </option>
      </select>
    </div>

    <!-- Program -->
    <div class="flex flex-col">
      <label class="text-xs font-semibold text-slate-600 mb-1">
        Program
      </label>
      <!-- Dropdown for filtering students by program -->
      <select
        :value="programFilter"
        @change="emit('update:programFilter', ($event.target as HTMLSelectElement).value)"
        class="w-44 rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
      >
        <!-- Dynamically render program options -->
        <option v-for="p in programs" :key="p" :value="p">
          {{ p }}
        </option>
      </select>
    </div>

    <!-- Organization -->
    <div class="flex flex-col">
      <label class="text-xs font-semibold text-slate-600 mb-1">
        Organization
      </label>
      <!-- Dropdown for filtering students by organization -->
      <select
        :value="organizationFilter"
        @change="emit('update:organizationFilter', ($event.target as HTMLSelectElement).value)"
        class="w-52 rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
      >
        <!-- Dynamically render organization options -->
        <option v-for="o in organizations" :key="o" :value="o">
          {{ o }}
        </option>
      </select>
    </div>

  </div>
</template>