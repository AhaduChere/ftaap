<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { CheckIcon, CheckBadgeIcon } from '@heroicons/vue/24/solid';
import type { Student_Notification } from '../../types/notifications';

const notifications = ref<Student_Notification[]>([]);

/** Fetch unread notifications from API */
const fetchNotifications = async () => {
  try {
    const res = await fetch('/api/notifications');
    if(!res.ok){
      console.error('Error getting notifications ', res.status, res.statusText);
    }
    const data = await res.json();
    console.log(data);

    // Convert BigInt IDs to number if necessary
     notifications.value = data.map((n: any) => ({
       ...n,
      id: Number(n.id),
     }));

    console.log('📥 Loaded', notifications.value.length, 'notifications');
  } catch (err) {
    console.error('Failed to fetch notifications', err);
  }
};

/** Mark a single notification as read */
const markAsRead = async (id: number) => {
  try {
    await fetch(`/api/notifications/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    notifications.value = notifications.value.filter(n => n.id !== id);
  } catch (err) {
    console.error('Failed to mark as read', err);
  }
};

/** Mark all notifications as read */
const markAllAsRead = async () => {
  try {
    await fetch('/api/notifications/markAll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    notifications.value = [];
  } catch (err) {
    console.error('Failed to mark all as read', err);
  }
};

/** Format timestamp nicely */
const formatDate = (date: string) => format(new Date(date), 'MMM dd, yyyy HH:mm');

onMounted(() => {
  fetchNotifications();
});
</script>

<template>
  <div class="w-full h-full flex flex-col space-y-2 overflow-y-auto p-2">
    <!-- Mark All as Read -->
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

    <!-- Notifications List -->
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

    <!-- Empty State -->
    <div v-if="notifications.length === 0" class="text-center text-gray-500 italic py-4">
      🎉 All caught up! No new notifications.
    </div>
  </div>
</template>

<style scoped>
div::-webkit-scrollbar {
  width: 6px;
}
div::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>