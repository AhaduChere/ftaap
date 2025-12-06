<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { CheckIcon, CheckBadgeIcon } from '@heroicons/vue/24/solid';
const useRequestURL = () => ({ origin: window.location.origin });

interface StudentNotification {
  id: number;
  name: string;
  level: 'red' | 'yellow' | 'green';
  message: string;
  timestamp: string;
  read: boolean;
}

const notifications = ref<StudentNotification[]>([]);

const fetchNotifications = async () => {
  try {
    const res = await fetch('/api/notifications'); // Nuxt handles this if file is correct
    notifications.value = await res.json();
    console.log('📥 Loaded', notifications.value.length, 'notifications');
  } catch (err) {
    console.error('Failed to fetch notifications', err);
  }
};

const markAsRead = async (id: number) => {
  try {
    const baseURL = useRequestURL().origin;
    await fetch(`${baseURL}/api/notifications/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    notifications.value = notifications.value.filter(n => n.id !== id);
  } catch (err) {
    console.error('Failed to mark as read', err);
  }
};

const markAllAsRead = async () => {
  try {
    // Call your backend API to mark all notifications as read
    await fetch('/api/notifications/markAll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    // Clear the notifications in the UI
    notifications.value = [];
  } catch (err) {
    console.error('Failed to mark all as read', err);
  }
};


const formatDate = (date: string) => format(new Date(date), 'MMM dd, yyyy HH:mm');

onMounted(() => {
  fetchNotifications();
});
</script>

<template>
  <div class="w-full h-full flex flex-col space-y-2 overflow-y-auto p-2">
    <div class="flex justify-end mb-2">
      <button
        @click="markAllAsRead"
        class="flex items-center gap-1 text-sm px-3 py-1 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition"
        :disabled="notifications.length === 0"
        :class="{ 'opacity-50 cursor-not-allowed': notifications.length === 0 }"
      >
        <CheckBadgeIcon class="w-5 h-5" />
        <span>Mark all as read</span>
      </button>
    </div>

    <div
      v-for="notif in notifications"
      :key="notif.id"
      class="p-3 rounded-md shadow flex flex-col gap-2 transition hover:scale-[1.01] hover:shadow-md"
      :class="{
        'bg-red-50 border border-red-400 text-red-800': notif.level === 'red',
        'bg-yellow-50 border border-yellow-400 text-yellow-800': notif.level === 'yellow',
        'bg-green-50 border border-green-400 text-green-800': notif.level === 'green'
      }"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <span
            class="inline-block w-3 h-3 rounded-full"
            :class="{
              'bg-red-500': notif.level === 'red',
              'bg-yellow-400': notif.level === 'yellow',
              'bg-green-500': notif.level === 'green'
            }"
          ></span>
          <span class="font-semibold">{{ notif.name }}</span>
        </div>
        <div class="flex items-center space-x-3">
          <span class="text-xs text-gray-500 whitespace-nowrap">
            {{ formatDate(notif.timestamp) }}
          </span>
          <button
            @click="markAsRead(notif.id)"
            class="text-gray-500 hover:text-green-600 transition"
            title="Mark as Read"
          >
            <CheckIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
      <div class="text-sm">{{ notif.message }}</div>
    </div>

    <div v-if="notifications.length === 0" class="text-center text-gray-500 italic py-4">
      🎉 All caught up! No new notifications.
    </div>
  </div>
</template>
