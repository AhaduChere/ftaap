// Notifications.vue
// Main page component for viewing all notifications.
// Matches manageStudents.vue layout exactly.

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

const { notifications, fetchAll } = useNotifications()

onMounted(() => {
  fetchAll()
})

const search       = ref('')
const sortMode     = ref('date_desc')
const levelFilter  = ref('all')
const statusFilter = ref('all')

const levelRank: Record<string, number> = { red: 0, yellow: 1, green: 2 }

const filtered = computed(() => {
  let list = [...notifications.value]

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(n => n.name.toLowerCase().includes(q))
  }

  if (levelFilter.value !== 'all') {
    list = list.filter(n => n.level === levelFilter.value)
  }

  if (statusFilter.value === 'unread') list = list.filter(n => !n.read)
  if (statusFilter.value === 'read')   list = list.filter(n => n.read)

  if (sortMode.value === 'date_desc') {
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } else if (sortMode.value === 'date_asc') {
    list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  } else if (sortMode.value === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortMode.value === 'level') {
    list.sort((a, b) => (levelRank[a.level] ?? 0) - (levelRank[b.level] ?? 0))
  }

  return list
})

// Mark as read in place — notification stays visible, just flips to read state
async function handleMarkAsRead(id: number) {
  try {
    await $fetch(`/api/notifications/read/${id}`, { method: 'POST', body: {} })
    const notif = notifications.value.find(n => n.id === id)
    if (notif) notif.read = true
  } catch (err) {
    console.error('handleMarkAsRead:', err)
  }
}
</script>

<template>
  <div class="h-screen overflow-hidden bg-gradient-to-b from-[#f7feff] to-slate-100">
    <div class="h-full flex flex-col">

      <div class="pt-32 shrink-0"></div>

      <main class="max-w-6xl mx-auto px-4 pb-4 flex-1 min-h-0 w-full">
        <section
          class="w-full max-h-full bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden flex flex-col"
        >
          <div class="shrink-0">
            <NotificationsHeader />
          </div>

          <div class="border-t border-slate-200 flex flex-col">
            <div class="px-4 py-3 bg-slate-50/80 border-b border-slate-200 shrink-0">
              <NotificationsControls
                v-model:search="search"
                v-model:sortMode="sortMode"
                v-model:levelFilter="levelFilter"
                v-model:statusFilter="statusFilter"
              />
            </div>

            <div class="p-4 bg-white">
              <div v-if="notifications.length === 0" class="py-8 text-center text-sm text-slate-500">
                Loading notifications…
              </div>
              <div v-else>
                <NotificationsTable
                  :rows="filtered"
                  @markAsRead="handleMarkAsRead"
                />
                <p
                  v-if="filtered.length === 0"
                  class="mt-3 text-xs text-slate-500 italic text-center"
                >
                  No notifications match your current filters.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  </div>
</template>