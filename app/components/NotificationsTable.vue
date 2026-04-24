// NotificationsTable.vue
// Table component for displaying all notifications.
// Matches StudentsTable style exactly.

<script setup lang="ts">
import { format } from 'date-fns'
import type { AppNotification } from '~/composables/useNotifications'

defineProps<{
  rows: AppNotification[]
}>()

const emit = defineEmits<{
  (e: 'markAsRead', id: number): void
}>()

const levelLabel: Record<string, string> = {
  red:    'Struggling',
  yellow: 'Danger',
  green:  'Strong',
}

const levelClass: Record<string, string> = {
  red:    'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  green:  'bg-green-100 text-green-700',
}

function formatDate(date: string) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return '—'
  return format(parsed, 'MMM dd, yyyy')
}
</script>

<template>
  <div class="w-full h-full min-h-0">
    <div class="table-scroll max-h-[520px] overflow-y-auto overflow-x-auto border border-slate-200 rounded-lg bg-white">
      <table class="min-w-full text-sm border-collapse">
        <thead class="bg-slate-50 text-slate-700 sticky top-0">
          <tr class="text-left">
            <th class="px-3 py-2 font-semibold">Student</th>
            <th class="px-3 py-2 font-semibold">Message</th>
            <th class="px-3 py-2 font-semibold">Level</th>
            <th class="px-3 py-2 font-semibold">Date</th>
            <th class="px-3 py-2 font-semibold">Status</th>
            <th class="px-3 py-2 font-semibold text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-200 bg-white">
          <tr
            v-for="row in rows"
            :key="row.id"
            class="hover:bg-slate-50/60"
            :class="{ 'opacity-50': row.read }"
          >
            <td class="px-3 py-2 font-medium text-slate-800">{{ row.name }}</td>
            <td class="px-3 py-2 text-slate-700">{{ row.message }}</td>
            <td class="px-3 py-2">
              <span
                class="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
                :class="levelClass[row.level] ?? 'bg-slate-100 text-slate-600'"
              >
                {{ levelLabel[row.level] ?? row.level }}
              </span>
            </td>
            <td class="px-3 py-2 text-slate-500 whitespace-nowrap">{{ formatDate(row.created_at) }}</td>
            <td class="px-3 py-2">
              <span
                class="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
                :class="row.read ? 'bg-slate-100 text-slate-500' : 'bg-[#e6f4f5] text-[#2e777e]'"
              >
                {{ row.read ? 'Read' : 'Unread' }}
              </span>
            </td>
            <td class="px-3 py-2">
              <div class="flex justify-end">
                <button
                  v-if="!row.read"
                  type="button"
                  class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border border-[#2e777e] text-[#2e777e] hover:bg-[#e6f4f5] transition"
                  @click="emit('markAsRead', row.id)"
                >
                  Mark as read
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td colspan="6" class="text-center py-6 text-xs text-slate-500 italic">
              No notifications to display.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-scroll {
  scrollbar-width: thin;
  scrollbar-color: #2e777e #f1f5f9;
}
.table-scroll::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.table-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 9999px;
}
.table-scroll::-webkit-scrollbar-thumb {
  background: #2e777e;
  border-radius: 9999px;
  border: 2px solid #f1f5f9;
}
.table-scroll::-webkit-scrollbar-thumb:hover {
  background: #245e64;
}
.table-scroll::-webkit-scrollbar-corner {
  background: #f1f5f9;
}
</style>