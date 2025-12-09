<script setup lang="ts">
import { ref } from 'vue';
import { format } from 'date-fns';

// Heroicons
import { CheckIcon } from '@heroicons/vue/24/solid';

interface StudentNotification {
  id: number;
  name: string;
  level: 'red' | 'yellow' | 'green';
  message: string;
  timestamp: Date;
  read: boolean;
}

const initialNotifications: StudentNotification[] = [
  { id: 1, name: 'Dan Daniels', level: 'red', message: 'Dropped from Yellow to Red', timestamp: new Date(), read: false },
  { id: 2, name: 'Eli Elliot', level: 'red', message: 'Dropped from Yellow to Red', timestamp: new Date(), read: false },
  { id: 3, name: 'Jenny Jenson', level: 'red', message: 'Dropped from Yellow to Red', timestamp: new Date(), read: false },
  { id: 4, name: 'Joe Jones', level: 'red', message: 'Dropped from Yellow to Red', timestamp: new Date(), read: false },
  { id: 5, name: 'Peter Peterson', level: 'red', message: 'Dropped from Yellow to Red', timestamp: new Date(), read: false },
];

const notifications = ref<StudentNotification[]>([...initialNotifications]);

// Sort by level: red → yellow → green
const sortedNotifications = () =>
  notifications.value
    .filter(n => !n.read) // only show unread
    .sort((a, b) => {
      const order = { red: 0, yellow: 1, green: 2 };
      return order[a.level] - order[b.level];
    });

const markAsRead = (id: number) => {
  const notif = notifications.value.find(n => n.id === id);
  if (notif) notif.read = true;
};

const formatDate = (date: Date) => format(date, 'MMM dd, yyyy HH:mm');
</script>

<template>
  <div class="w-full h-full flex flex-col space-y-2 overflow-y-auto p-2">
    <!-- Notifications list -->
    <div
      v-for="notif in sortedNotifications()"
      :key="notif.id"
      class="p-3 rounded-md shadow flex flex-col gap-2 transition hover:scale-[1.01] hover:shadow-md"
      :class="{
        'bg-red-50 border border-red-400 text-red-800': notif.level === 'red',
        'bg-yellow-50 border border-yellow-400 text-yellow-800': notif.level === 'yellow',
        'bg-green-50 border border-green-400 text-green-800': notif.level === 'green'
      }"
    >
      <!-- Header row: Name + Timestamp + Mark as Read -->
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

      <!-- Message -->
      <div class="text-sm">
        {{ notif.message }}
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="sortedNotifications().length === 0" class="text-center text-gray-500 italic py-4">
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
