<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

const { notifications, fetchAll } = useNotifications()

onMounted(() => {
  fetchAll()
})

// Controls state
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
</script>

<template>
  <div class="bg-[#f7feff] min-h-screen pt-20 px-8 pb-12">
    <div class="max-w-5xl mx-auto flex flex-col gap-0 border border-slate-200 rounded-xl overflow-hidden shadow-md bg-white">

      <!-- Header -->
      <NotificationsHeader />

      <!-- Controls + Table -->
      <div class="p-6 flex flex-col gap-6">
        <NotificationsControls
          v-model:search="search"
          v-model:sortMode="sortMode"
          v-model:levelFilter="levelFilter"
          v-model:statusFilter="statusFilter"
        />
        <NotificationsTable :rows="filtered" />
      </div>

    </div>
  </div>
</template>