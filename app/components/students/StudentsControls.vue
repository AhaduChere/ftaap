<script setup lang="ts">
const props = defineProps<{
  search: string
  sortMode: string
  gradeFilter: string
  programFilter: string
  organizationFilter: string
  grades: string[]
  programs: string[]
  organizations: string[]
}>()

const emit = defineEmits<{
  (e: 'update:search', v: string): void
  (e: 'update:sortMode', v: string): void
  (e: 'update:gradeFilter', v: string): void
  (e: 'update:programFilter', v: string): void
  (e: 'update:organizationFilter', v: string): void
}>()
</script>

<template>
  <div class="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
    <!-- Search -->
    <div class="flex flex-col">
      <label class="text-xs font-semibold text-slate-600 mb-1">
        Search
      </label>
      <input
        :value="search"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Name, program, organization, grade…"
        class="w-64 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
      />
    </div>

    <!-- Sort -->
    <div class="flex flex-col">
      <label class="text-xs font-semibold text-slate-600 mb-1">
        Sort
      </label>
      <select
        :value="sortMode"
        @change="emit('update:sortMode', ($event.target as HTMLSelectElement).value)"
        class="w-40 rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
      >
        <option value="name">Name</option>
        <option value="grade_asc">Grade ↑</option>
        <option value="grade_desc">Grade ↓</option>
      </select>
    </div>

    <!-- Grade -->
    <div class="flex flex-col">
      <label class="text-xs font-semibold text-slate-600 mb-1">
        Grade
      </label>
      <select
        :value="gradeFilter"
        @change="emit('update:gradeFilter', ($event.target as HTMLSelectElement).value)"
        class="w-28 rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
      >
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
      <select
        :value="programFilter"
        @change="emit('update:programFilter', ($event.target as HTMLSelectElement).value)"
        class="w-44 rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
      >
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
      <select
        :value="organizationFilter"
        @change="emit('update:organizationFilter', ($event.target as HTMLSelectElement).value)"
        class="w-52 rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
      >
        <option v-for="o in organizations" :key="o" :value="o">
          {{ o }}
        </option>
      </select>
    </div>
  </div>
</template>
