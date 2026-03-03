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
    class="fixed w-screen h-16 bg-[#2e777e] flex items-center justify-between navBarDropShadow border-b border-1 border-[#16383b]"
    title="Menu">
    <Icon id="icon" name="arcticons:hamburger-menu" class="h-10 w-10 text-[#e2fafc] cursor-pointer ml-2" @click="toggleSidebar"></Icon>
    <h1 class="text-[#e2fafc] text-center">FAST Track Academy Student Progress Tracking</h1>
    <div class="h-10 w-10 text-[#e2fafc] cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
        <path
          fill="currentColor"
          d="M10 14q-1.25 0-2.125-.875T7 11q0-.55.175-1.037t.525-.888q-.1-.25-.15-.525T7.5 8q0-.95.513-1.687T9.35 5.225q.5-.575 1.175-.9T12 4t1.475.325t1.175.9q.825.35 1.338 1.088T16.5 8q0 .275-.05.55t-.15.525q.35.4.525.888T17 11q0 1.25-.875 2.125T14 14zm-6 8v-2.8q0-.85.438-1.562T5.6 16.55q1.55-.775 3.15-1.162T12 15t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 19.2V22z" />
      </svg>
    </div>
  </div>

  <!-- Displays side menu if hamburger menu is clicked-->
  <SideMenu :is-open="isSidebarOpen" @close="isSidebarOpen = false" />
</template>

<style>
.navBarDropShadow {
  box-shadow: 0 1px 5px #16383b;
  z-index: 5;
}
</style>
