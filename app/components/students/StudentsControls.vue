<script setup lang="ts">
const props = defineProps<{
  search: string
  sortMode: string
  gradeFilter: string
  programFilter: string
  grades: string[]
  programs: string[]
}>()

const emit = defineEmits([
  'update:search',
  'update:sortMode',
  'update:gradeFilter',
  'update:programFilter',
])

function onSearchInput(event: Event) {
  emit('update:search', (event.target as HTMLInputElement).value)
}

function onSortChange(event: Event) {
  emit('update:sortMode', (event.target as HTMLSelectElement).value)
}

function onGradeChange(event: Event) {
  emit('update:gradeFilter', (event.target as HTMLSelectElement).value)
}

function onProgramChange(event: Event) {
  emit('update:programFilter', (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <section
    class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-3 bg-white"
  >
    <!-- Search box -->
    <div class="flex-1">
      <label class="block text-xs font-semibold text-slate-600 mb-1">
        Search
      </label>
      <input
        type="text"
        class="w-full max-w-md rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]/70 focus:border-[#2e777e]"
        :value="props.search"
        placeholder="Search by name, program, or grade level…"
        @input="onSearchInput"
      />
    </div>

    <!-- Filters + Sort -->
    <div class="flex flex-wrap gap-3 md:justify-end">
      <!-- Grade filter -->
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">
          Grade Level
        </label>
        <select
          class="rounded-md border border-slate-300 px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]/70 focus:border-[#2e777e]"
          :value="props.gradeFilter"
          @change="onGradeChange"
        >
          <option
            v-for="g in props.grades"
            :key="g"
            :value="g"
          >
            {{ g }}
          </option>
        </select>
      </div>

      <!-- Program filter -->
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">
          Program
        </label>
        <select
          class="rounded-md border border-slate-300 px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]/70 focus:border-[#2e777e]"
          :value="props.programFilter"
          @change="onProgramChange"
        >
          <option
            v-for="p in props.programs"
            :key="p"
            :value="p"
          >
            {{ p }}
          </option>
        </select>
      </div>

      <!-- Sort mode -->
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">
          Sort by
        </label>
        <select
          class="rounded-md border border-slate-300 px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]/70 focus:border-[#2e777e]"
          :value="props.sortMode"
          @change="onSortChange"
        >
          <option value="name">Name (A → Z)</option>
          <option value="grade_asc">Grade (Low → High)</option>
          <option value="grade_desc">Grade (High → Low)</option>
        </select>
      </div>
    </div>
  </section>
</template>
