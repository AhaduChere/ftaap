<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js';
import { watch, onMounted, onBeforeUnmount } from 'vue';
const { $supabase } = useNuxtApp();
const supabase = $supabase as SupabaseClient;

const emit = defineEmits(['close']);
const props = defineProps({ isOpen: Boolean });
const admin = ref(false);

const closeMenu = () => emit('close');

function handleOutsideClick(e: MouseEvent) {
  const menu = document.querySelector('.sideMenuDropShadow');
  const navbarIcon = document.querySelector('#icon');
  if (navbarIcon && navbarIcon.contains(e.target as Node)) {
    return;
  } else if (menu && !menu.contains(e.target as Node)) {
    closeMenu();
  }
}

watch(
  () => props.isOpen,
  (open) => {
    if (typeof document === 'undefined') return;

    if (open) {
      document.addEventListener('click', handleOutsideClick, true);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('click', handleOutsideClick, true);
      document.body.style.overflow = '';
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleOutsideClick, true);
  }
});

async function logout() {
  await supabase.auth.signOut();
  window.location.reload();
}

onMounted(async () => {
  const { data: userdata } = await supabase.auth.getUser();

  const data = await $fetch('/api/admin', {
    method: 'POST',
    body: {
      userId: userdata?.user.id,
    },
  });
  if (data.isAdmin) {
    admin.value = !!data.isAdmin;
  } else {
    admin.value = false;
  }
});
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
            <div class="px-4 py-3 font-semibold text-lg text-[#e2fafc] border-b border-white/30 no-select">Dashboard</div>
            <div class="text-[#e2fafc]">
              <NuxtLink to="/" class="block px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer" @click="closeMenu">
                Overview
              </NuxtLink>
            </div>
          </li>

          <!-- Students -->
          <li>
            <div class="px-4 py-3 font-semibold text-lg text-[#e2fafc] border-b border-white/30 no-select">Students</div>
            <div class="text-[#e2fafc]">
              <NuxtLink
                to="/manageStudents"
                class="block px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer"
                @click="closeMenu">
                Manage Students
              </NuxtLink>
              <NuxtLink
                to="/archivedStudents"
                class="block px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer"
                @click="closeMenu">
                Archived Students
              </NuxtLink>
            </div>
          </li>

          <!-- Teachers -->
          <li v-if="admin">
            <div class="px-4 py-3 font-semibold text-lg text-[#e2fafc] border-b border-white/30 no-select">Admin</div>
            <div class="text-[#e2fafc]">
              <NuxtLink
                to="/manageTeachers"
                class="block px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer"
                @click="closeMenu">
                Manage Teachers
              </NuxtLink>
              <NuxtLink
                to="/manageOrgs"
                class="block px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer"
                @click="closeMenu">
                Manage Organizations
              </NuxtLink>
              <!-- <div class="px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer" @click="closeMenu">Analytics</div> -->
            </div>
          </li>

          <!--Students' Scores-->
          <li>
            <div class="px-4 py-3 font-semibold text-lg text-[#e2fafc] border-b border-white/30 no-select">Grades</div>
            <div class="text-[#e2fafc]">
              <NuxtLink
                to="/progressReport/report"
                class="block px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer"
                @click="closeMenu">
                Progress Tracker
              </NuxtLink>
              <NuxtLink
                to="/gradebook"
                class="block px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer"
                @click="closeMenu">
                Gradebook
              </NuxtLink>
            </div>
          </li>

          <!-- Settings -->
          <li>
            <div class="px-4 py-3 font-semibold text-lg text-[#e2fafc] border-b border-white/30 no-select">Settings</div>
            <div class="text-[#e2fafc]">
              <NuxtLink to="/Account" class="block px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer" @click="closeMenu">
                Account
              </NuxtLink>
              <NuxtLink
                to="/notifications"
                class="block px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer"
                @click="closeMenu">
                Notifications
              </NuxtLink>
            </div>
          </li>
        </ul>
      </div>

      <!-- Footer -->
      <div class="border-t border-white/40 px-4 py-3 flex items-center justify-between text-[#e2fafc]">
        <span class="text-sm">FAST Track Academy</span>
        <button class="text-2xl cursor-pointer" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="currentColor">
              <path
                d="M6.5 3.75c-.526 0-1.25.63-1.25 1.821V18.43c0 1.192.724 1.821 1.25 1.821h6.996a.75.75 0 1 1 0 1.5H6.5c-1.683 0-2.75-1.673-2.75-3.321V5.57c0-1.648 1.067-3.321 2.75-3.321h7a.75.75 0 0 1 0 1.5z" />
              <path
                d="M16.53 7.97a.75.75 0 0 0-1.06 0v3.276H9.5a.75.75 0 0 0 0 1.5h5.97v3.284a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0 .22-.532v-.002a.75.75 0 0 0-.269-.575z" />
            </g>
          </svg>
        </button>
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
  z-index: 2;
}
.no-select {
  user-select: none;
  cursor: default;
}
</style>
