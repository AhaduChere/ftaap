<script setup>
import { ref } from 'vue'
import SideMenu from '~/components/sideMenu.vue'


    const isSidebarOpen = ref(false)

    const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value
    }
</script>

<template>
    <!-- This creates the top navigation bar -->
    <div class="fixed w-screen h-16 bg-[#2e777e] flex items-center justify-end justify-between navBarDropShadow border-b border-1 border-[#16383b]" title="Menu">
        <Icon @click="toggleSidebar" name="arcticons:hamburger-menu" class="h-10 w-10 text-[#e2fafc] cursor-pointer ml-2"></Icon>
        <h1 class="text-[#e2fafc] text-center">FAST Track Academy Student Progress Tracking</h1>
        <Icon name="material-symbols-light:logout" class="h-10 w-10 text-[#e2fafc] cursor-pointer mr-2" title="Logout" />
    </div>

    <!-- Displays side menu if hamburger menu is clicked-->
    <SideMenu :isOpen="isSidebarOpen" @close="isSidebarOpen = false"/>
    <mainDash></mainDash>
  </template>

<style>
.navBarDropShadow {
    box-shadow: 0 1px 5px #16383b;
    z-index: 1000;
}
</style>
