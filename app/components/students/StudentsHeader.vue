// StudentsHeader.vue
// Header component for the student management page.
// This component handles:
// - displaying the page title
// - providing an "Add Student" action button
// - emitting an event when the add button is clicked


<script setup lang="ts">

// Event emitted when the "Add Student" button is clicked
const emit = defineEmits<{
  (e: 'add'): void // trigger opening of add student modal
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

    <!-- Add Student Button  -->
    <!-- Clicking this button emits the "add" event to parent -->
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
      <!-- Plus icon -->
      <span class="text-base leading-none">＋</span>

      <!-- Button label -->
      <span>Add Student</span>
    </button>
  </header>
</template>