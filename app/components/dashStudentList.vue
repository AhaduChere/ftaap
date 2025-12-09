<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { students, fetchStudents, searchQuery, sortMode, tierFilter } from '~/composables/useStudentListStore';

// Computed properties for v-model
const search = computed({
  get: () => searchQuery.value,
  set: (v: string) => (searchQuery.value = v),
});

const sort = computed({
  get: () => sortMode.value,
  set: (v: 'A - Z' | 'By color') => (sortMode.value = v),
});

const tier = computed({
  get: () => tierFilter.value,
  set: (v: 'All' | 'Strong' | 'Danger' | 'Struggling') => (tierFilter.value = v),
});

// Fetch students when component mounts
onMounted(() => {
  fetchStudents();
});
</script>

<template>
  <div
    class="w-3/4 bg-[#2e777e] border border-[#2e777e] rounded-md drop-shadow p-4 flex flex-col gap-3 text-white"
  >
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Search input -->
      <input
        v-model="search"
        type="text"
        placeholder="Search students…"
        class="flex-1 px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 placeholder-gray-500 border"
      />

      <!-- Sort select -->
      <select
        v-model="sort"
        class="px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 border"
      >
        <option>A - Z</option>
        <!-- Disabled until performanceTier is implemented -->
        <option disabled>By color</option>
      </select>

      <!-- Tier filter select -->
      <select
        v-model="tier"
        class="px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 border"
      >
        <option>All</option>
        <!-- Disabled until performanceTier is implemented -->
        <option disabled>Struggling</option>
        <option disabled>Danger</option>
        <option disabled>Strong</option>
      </select>
    </div>

    <!-- Optional: show count of students -->
    <!-- <div class="mt-2 text-white">
      Showing {{ students.length }} students
    </div> -->
  </div>
</template>