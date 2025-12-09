<script setup lang="ts">
import { computed } from 'vue'
import { useStudentListStore, type SortMode } from '~/composables/useStudentListStore'

const { searchQuery, sortMode } = useStudentListStore()

const search = computed({
  get: () => searchQuery.value,
  set: (v: string) => (searchQuery.value = v),
})

const sort = computed<SortMode>({
  get: () => sortMode.value,
  set: (v: SortMode) => (sortMode.value = v),
})
</script>



<template>
  <div
    class="w-3/4 bg-[#2e777e] border border-[#2e777e] rounded-md drop-shadow p-4
           flex flex-col gap-3 text-white"
  >
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Search box -->
      <input
        v-model="search"
        type="text"
        placeholder="Search students…"
        class="flex-1 px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 placeholder-gray-500 border"
      />

      <!-- Sort selector -->
      <select
        v-model="sort"
        class="px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 border"
      >
        <option value="A - Z">Name (A – Z)</option>
        <option value="By color">Grade level</option>
      </select>
    </div>
  </div>
</template>
