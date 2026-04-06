<script setup>
import { ref } from 'vue';
import SideMenu from '~/components/sideMenu.vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Real-time clock
const time = ref('');

function updateTime() {
  const now = new Date();
  time.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

let clockInterval;

onMounted(() => {
  updateTime();
  clockInterval = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  clearInterval(clockInterval);
});
</script>

<template>
  <!-- This creates the top navigation bar -->
  <div
    class="fixed w-screen h-16 bg-[#2e777e] flex items-center justify-between navBarDropShadow border-b border-1 border-[#16383b]"
    title="Menu">
    <button id="icon" @click="toggleSidebar">
      <div class="h-10 w-[4rem] text-[#e2fafc] cursor-pointer ml-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 48 48">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5.5 24h37m-37 13h37m-37-26h37" />
        </svg>
      </div>
    </button>
    <img class="h-full mb-3" src="/possibleFASTTrackLogo2.png" />
    <div class="h-full flex items-center justify-end pr-4 text-[#e2fafc]">
      <span class="text-sm font-mono tracking-wide">{{ time }}</span>
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
