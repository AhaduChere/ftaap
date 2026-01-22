<script setup>
import { watch, onMounted } from 'vue';

const emit = defineEmits(['close']);
const props = defineProps({
  isOpen: Boolean,
});

const closeMenu = () => emit('close');

onMounted(() => {
  watch(
    () => props.isOpen,
    (open) => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = open ? 'hidden' : '';
      }
    },
    { immediate: true }
  );
});
async function logout() {
  await $fetch('/api/logout', { method: 'POST' });
  window.location.reload();
}
</script>

<template>
  <Transition name="slide">
    <div v-if="isOpen" class="fixed left-0 top-0 h-screen w-full sm:w-80 bg-[#2e777e] drop-shadow-lg sideMenuDropShadow flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-4 border-b border-white/40">
        <h2 class="text-xl font-semibold text-[#e2fafc] tracking-wide">Menu</h2>
        <Icon name="mdi:close" class="text-[#e2fafc] text-3xl cursor-pointer" @click="closeMenu" />
      </div>

      <!-- Menu Items -->
      <div class="flex-1 overflow-y-auto">
        <ul class="py-2">
          <!-- Dashboard -->
          <li>
            <div class="px-4 py-3 font-semibold text-lg text-[#e2fafc] border-b border-white/30 hover:bg-[#205a5f] no-select">
              Dashboard
            </div>
            <div class="text-[#e2fafc]">
              <NuxtLink to="/" class="block px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer">
                Overview
              </NuxtLink>
              <div class="px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer">Reports</div>
              <div class="px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer">Analytics</div>
            </div>
          </li>

          <!-- Students -->
          <li>
            <div class="px-4 py-3 font-semibold text-lg text-[#e2fafc] border-b border-white/30 hover:bg-[#205a5f] no-select">
              Dashboard
            </div>
            <div class="text-[#e2fafc]">
              <NuxtLink to="/manage-students" class="block px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer">
                Manage Students
              </NuxtLink>
              <NuxtLink to="/progress-report" class="block px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer">
                Progress Tracker
              </NuxtLink>
              <div class="px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer">Attendance</div>
              <div class="px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer">Gradebook</div>
            </div>
          </li>

          <!-- Settings -->
          <li>
            <div class="px-4 py-3 font-semibold text-lg text-[#e2fafc] border-b border-white/30 hover:bg-[#205a5f] no-select">Settings</div>
            <div class="text-[#e2fafc]">
              <div class="px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer">Account</div>
              <div class="px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer">Notifications</div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Footer -->
      <div class="border-t border-white/40 px-4 py-3 flex items-center justify-between text-[#e2fafc]">
        <span class="text-sm">FAST Track Academy</span>
        <Icon name="material-symbols-light:logout" class="text-2xl cursor-pointer" title="Logout" @click="logout" />
      </div>
    </div>
  </Transition>
</template>

<style>
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave-from {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(-100%);
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s ease-in-out;
}
.sideMenuDropShadow {
  box-shadow: 2px 0 10px #16383b;
  z-index: 999;
}
.no-select {
  user-select: none;
  cursor: default;
}
</style>
