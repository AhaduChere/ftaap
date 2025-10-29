<script setup lang="ts">
const emit = defineEmits<{ (e: 'add'): void }>()
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 bg-[#2e777e] text-white rounded-t-md">
    <h1 class="text-xl font-semibold">Student Management</h1>
    <button
      @click="emit('add')"
      class="flex items-center gap-2 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 ring-2 ring-white/50"
      title="Add New Student"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6Z" />
      </svg>
      <span class="font-medium">Add New Student</span>
    </button>
  </div>
</template>
