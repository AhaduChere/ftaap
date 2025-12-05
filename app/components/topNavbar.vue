<script setup>
import { ref } from 'vue';
import SideMenu from '~/components/sideMenu.vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <!-- This creates the top navigation bar -->
  <div
    class="fixed w-screen h-16 bg-[#2e777e] flex items-center justify-end justify-between navBarDropShadow border-b border-1 border-[#16383b]"
    title="Menu">
    <Icon name="arcticons:hamburger-menu" class="h-10 w-10 text-[#e2fafc] cursor-pointer ml-2" @click="toggleSidebar"></Icon>
    <h1 class="text-[#e2fafc] text-center">FAST Track Academy Student Progress Tracking</h1>
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="h-10 w-10 text-[#e2fafc] cursor-pointer mr-2">
      <path
        fill="currentColor"
        d="M18.39 14.56C16.71 13.7 14.53 13 12 13s-4.71.7-6.39 1.56A2.97 2.97 0 0 0 4 17.22V18c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-.78c0-1.12-.61-2.15-1.61-2.66M10 12h4c1.66 0 3-1.34 3-3c0-.73-.27-1.4-.71-1.92c.13-.33.21-.7.21-1.08a3 3 0 0 0-1.86-2.77C14 2.48 13.06 2 12 2s-2 .48-2.64 1.23A3 3 0 0 0 7.5 6c0 .38.08.75.21 1.08C7.27 7.6 7 8.27 7 9c0 1.66 1.34 3 3 3" />
    </svg>
  </div>

  <!-- Displays side menu if hamburger menu is clicked-->
  <SideMenu :is-open="isSidebarOpen" @close="isSidebarOpen = false" />
</template>

<style>
.navBarDropShadow {
  box-shadow: 0 1px 5px #16383b;
  z-index: 1000;
}
</style>
