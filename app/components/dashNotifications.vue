<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import type { Student_Notification } from '../../types/notifications';

const notifications = ref<Student_Notification[]>([]);

const fetchNotifications = async () => {
  try {
    const res = await fetch('/api/notifications');
    if (!res.ok) {
      console.error('Error getting notifications', res.status, res.statusText);
    }
    const data = await res.json();
    notifications.value = data.map((n: any) => ({
      ...n,
      id: Number(n.id),
    }));
  } catch (err) {
    console.error('Failed to fetch notifications', err);
  }
};

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

const markAllAsRead = async () => {
  try {
    await fetch('/api/notifications/markAll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    notifications.value = [];
  } catch (err) {
    console.error('Failed to mark all as read', err);
  }
};

const formatDate = (date: string) => {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return 'Unknown date'
  return format(parsed, 'MMM dd, yyyy')
}

onMounted(() => {
  fetchNotifications();
});
</script>

<template>
  <div class="flex flex-col h-full rounded-md overflow-hidden border border-[#2e777e] drop-shadow-lg">
    <!-- Teal header with title + mark all as read -->
    <header class="bg-[#2e777e] text-white px-4 py-4 flex items-center justify-between shrink-0">
      <h2 class="text-2xl font-bold tracking-wide">Notifications</h2>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm transition
               bg-[#4aa9b1] hover:bg-[#5cc3cc]
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5cc3cc]
               disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="notifications.length === 0"
        @click="markAllAsRead"
      >
        <span>Mark all as read</span>
      </button>
    </header>

    <!-- Notification rows -->
    <div class="flex-1 min-h-0 overflow-y-auto bg-white">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        class="flex items-center justify-between px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
        @click="markAsRead(notif.id)"
      >
        <!-- Left: name + message -->
        <div>
          <div class="font-semibold text-[#2e777e]">{{ notif.name }}</div>
          <div class="text-sm text-slate-500">{{ notif.message }}</div>
        </div>

        <!-- Right: date + check button -->
        <div class="flex items-center gap-3 shrink-0 ml-4">
          <span class="text-xs text-slate-400 whitespace-nowrap">{{ formatDate(notif.timestamp) }}</span>
          <button
            class="w-7 h-7 rounded-full bg-[#2e777e] hover:bg-[#4aa9b1] flex items-center justify-center transition-colors shrink-0"
            title="Mark as read"
            @click.stop="markAsRead(notif.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="notifications.length === 0" class="text-center text-gray-400 italic py-8">
        🎉 All caught up! No new notifications.
      </div>
    </div>
  </div>
</template>

<style scoped>
div::-webkit-scrollbar { width: 6px; }
div::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.2); border-radius: 3px; }
</style>
