<script setup lang="ts">
import { computed } from 'vue';
import { searchQuery, sortMode, tierFilter } from '~/composables/useStudentListStore'; //not needed in vue but left for clarity


//define types for the select inputs
type Performance = 'All' | 'Strong' | 'Danger' | 'Struggling';
type SortMode = 'A - Z' | 'By color';

// Computed properties to bind to the input/select elements
const search = computed({
  get: () => searchQuery.value,
  set: (v: string) => (searchQuery.value = v),
});
// Computed property for the sort mode select
const sort = computed({
  get: () => sortMode.value,
  set: (v: SortMode) => (sortMode.value = v),
});
// Computed property for the performance tier filter select
const tier = computed({
  get: () => tierFilter.value,
  set: (v: Performance) => (tierFilter.value = v),
});
</script>

<template>
    
  <div
    class="w-3/4 bg-[#2e777e] border border-[#2e777e] rounded-md drop-shadow p-4
           flex flex-col gap-3 text-white"
  >
    <div class="flex flex-col sm:flex-row gap-3">
      <input
        v-model="search"
        type="text"
        placeholder="Search students…"
        class="flex-1 px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 placeholder-gray-500 border"
      />
      <select
        v-model="sort"
        class="px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 border"
      >
        <option>By color</option>
        <option>A - Z</option>
      </select>
      <select
        v-model="tier"
        class="px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 border"
      >
        <option>All</option>
        <option>Struggling</option>
        <option>Danger</option>
        <option>Strong</option>
      </select>
    </div>
  </div>
</template>

