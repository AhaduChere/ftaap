<script setup lang="ts">
const emit = defineEmits<{
  (e: 'add'): void
}>()
</script>

<template>
  <!-- Clean teal header bar -->
  <header
    class="bg-[#2e777e] text-white px-4 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
  >
    <!-- Title -->
    <h1 class="text-xl md:text-2xl font-semibold tracking-wide">
      Student Management
    </h1>

    <!-- Add Student Button (lighter teal version of header color) -->
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-full 
             px-4 py-2 text-xs font-semibold text-white shadow-sm
             transition
             bg-[#4aa9b1] hover:bg-[#5cc3cc] 
             focus:outline-none focus:ring-2 focus:ring-offset-2 
             focus:ring-[#5cc3cc]"
      @click="emit('add')"
    >
      <span class="text-base leading-none">＋</span>
      <span>Add Student</span>
    </button>
  </header>
</template>
