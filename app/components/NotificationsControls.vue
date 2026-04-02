// NotificationsControls.vue
// Filter and sorting controls for the notifications page.
// This component handles:
// - search input for filtering by student name
// - sorting by date, student name, or level
// - filtering by level (all, red, yellow, green)
// - filtering by read status

<script setup lang="ts">
defineProps<{
  search: string
  sortMode: string
  levelFilter: string
  statusFilter: string
}>()

const emit = defineEmits<{
  (e: 'update:search', v: string): void
  (e: 'update:sortMode', v: string): void
  (e: 'update:levelFilter', v: string): void
  (e: 'update:statusFilter', v: string): void
}>()
</script>

<template>
  <div class="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">

    <!-- Search -->
    <div class="flex flex-col">
      <label class="text-xs font-semibold text-slate-600 mb-1">Search</label>
      <input
        :value="search"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Student name…"
        class="w-56 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
      />
    </div>

    <!-- Sort -->
    <div class="flex flex-col">
      <label class="text-xs font-semibold text-slate-600 mb-1">Sort</label>
      <select
        :value="sortMode"
        @change="emit('update:sortMode', ($event.target as HTMLSelectElement).value)"
        class="w-44 rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
      >
        <option value="date_desc">Newest first</option>
        <option value="date_asc">Oldest first</option>
        <option value="name">Student name</option>
        <option value="level">Level</option>
      </select>
    </div>

    <!-- Level filter -->
    <div class="flex flex-col">
      <label class="text-xs font-semibold text-slate-600 mb-1">Level</label>
      <select
        :value="levelFilter"
        @change="emit('update:levelFilter', ($event.target as HTMLSelectElement).value)"
        class="w-36 rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
      >
        <option value="all">All levels</option>
        <option value="red">Struggling</option>
        <option value="yellow">Danger</option>
        <option value="green">Strong</option>
      </select>
    </div>

    <!-- Status filter -->
    <div class="flex flex-col">
      <label class="text-xs font-semibold text-slate-600 mb-1">Status</label>
      <select
        :value="statusFilter"
        @change="emit('update:statusFilter', ($event.target as HTMLSelectElement).value)"
        class="w-36 rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
      >
        <option value="all">All</option>
        <option value="unread">Unread</option>
        <option value="read">Read</option>
      </select>
    </div>

  </div>
</template>