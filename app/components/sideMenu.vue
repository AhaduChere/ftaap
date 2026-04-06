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
  const {
    data: { session },
  } = await $supabase.auth.getSession();

  const data = await $fetch('/api/admin', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: {
      userId: session.user.id,
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
              <div class="px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer" @click="closeMenu">Analytics</div>
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
              <div class="px-8 py-2 border-b border-white/20 hover:bg-[#205a5f] cursor-pointer" @click="closeMenu">Notifications</div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Footer -->
      <div class="border-t border-white/40 px-4 py-3 flex items-center justify-between text-[#e2fafc]">
        <span class="text-sm">FAST Track Academy</span>
        <button @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h6.403v1H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h6.404v1zm10.846-4.461l-.702-.72l2.319-2.319H9.192v-1h8.887l-2.32-2.32l.702-.718L20 12z" />
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
