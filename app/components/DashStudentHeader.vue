<script setup lang="ts">
const props = defineProps<{
  search: string
  sort: 'A - Z' | 'By color'
  tier: 'All' | 'Strong' | 'Danger' | 'Struggling'
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:sort', value: 'A - Z' | 'By color'): void
  (e: 'update:tier', value: 'All' | 'Strong' | 'Danger' | 'Struggling'): void
}>()
</script>

<template>
  <div class="shrink-0">
    <!-- Teal title bar -->
    <div class="bg-[#2e777e] text-white px-4 py-4">
      <h1 class="text-2xl font-bold tracking-wide">Students</h1>
    </div>

    <!-- Search + filter strip -->
    <div class="bg-slate-100 px-4 py-3 flex flex-col sm:flex-row gap-2 border-b border-slate-200">
      <input
        :value="search"
        type="text"
        placeholder="Name..."
        class="flex-1 px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 placeholder-gray-400 border border-slate-300 text-sm"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
      />
      <select
        :value="sort"
        class="px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 border border-slate-300 text-sm"
        @change="emit('update:sort', ($event.target as HTMLSelectElement).value as 'A - Z' | 'By color')"
      >
        <option>A - Z</option>
        <option>By color</option>
      </select>
      <select
        :value="tier"
        class="px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200
               bg-white text-gray-900 border border-slate-300 text-sm"
        @change="emit('update:tier', ($event.target as HTMLSelectElement).value as 'All' | 'Strong' | 'Danger' | 'Struggling')"
      >
        <option>All</option>
        <option>Struggling</option>
        <option>Danger</option>
        <option>Strong</option>
      </select>
    </div>
  </div>
</template>