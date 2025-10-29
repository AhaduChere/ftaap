<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  searchQuery,
  sortMode,
  tierFilter,
  resetStudentFilters,
  refreshStudentList,
} from '~/composables/useStudentListStore'

// Import the actual types from the store so they never drift out of sync
import type {
  Performance as StorePerformance,
  SortMode as StoreSortMode,
} from '~/composables/useStudentListStore'

// Optional: allow dashboard to request a clean slate on mount
const props = defineProps<{ resetOnMount?: boolean }>()

onMounted(() => {
  if (props.resetOnMount) resetStudentFilters()
  // Ensure we have data even if nothing else has triggered a fetch yet
  refreshStudentList().catch(() => {})
})

// Computed bindings for v-model
const search = computed<string>({
  get: () => searchQuery.value,
  set: (v: string) => (searchQuery.value = (v ?? '').trimStart()),
})

const sort = computed<StoreSortMode>({
  get: () => sortMode.value,
  set: (v: StoreSortMode) => (sortMode.value = v ?? 'By color'),
})

const tier = computed<StorePerformance>({
  get: () => tierFilter.value,
  set: (v: StorePerformance) => (tierFilter.value = v ?? 'All'),
})
</script>

<template>
  <div
    class="w-3/4 bg-[#2e777e] border border-[#2e777e] rounded-md drop-shadow p-4
           flex flex-col gap-3 text-white"
  >
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Search -->
      <input
        v-model="search"
        type="text"
        placeholder="Search students…"
        class="flex-1 px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 placeholder-gray-500 border"
      />

      <!-- Sort -->
      <select
        v-model="sort"
        class="px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 border"
      >
        <option value="By color">By color</option>
        <option value="A - Z">A - Z</option>
      </select>

      <!-- Tier Filter -->
      <select
        v-model="tier"
        class="px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 border"
      >
        <option value="All">All</option>
        <option value="Intensive">Intensive</option>
        <option value="Strategic">Strategic</option>
        <option value="Core">Core</option>
      </select>
    </div>
  </div>
</template>
