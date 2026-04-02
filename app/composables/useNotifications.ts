import { ref } from 'vue'
import { useNuxtApp } from '#app'
import type { SupabaseClient } from '@supabase/supabase-js'

export type NotificationLevel = 'red' | 'yellow' | 'green'

export type AppNotification = {
  id: number
  teacher_id: number
  student_id: number
  name: string
  message: string
  level: NotificationLevel
  created_at: string
  read: boolean
  read_at: string | null
}

export const useNotifications = () => {
  const { $supabase } = useNuxtApp()
  const supabase = $supabase as SupabaseClient

  const notifications = ref<AppNotification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch only unread notifications — used by dashNotifications
  const fetchUnread = async () => {
    loading.value = true
    error.value = null
    try {
      const { data: userData } = await supabase.auth.getUser()
      const authId = userData?.user?.id
      if (!authId) throw new Error('Not authenticated')

      const res = await $fetch<{ success: boolean, notifications: AppNotification[] }>(`/api/notifications/${authId}`)
      if (res.success) {
        notifications.value = res.notifications.map((n: any) => ({ ...n, id: Number(n.id) }))
      }
    } catch (err: any) {
      error.value = err.message ?? 'Failed to fetch notifications'
      console.error('fetchUnread:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch all notifications (read + unread) — used by notifications page
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const { data: userData } = await supabase.auth.getUser()
      const authId = userData?.user?.id
      if (!authId) throw new Error('Not authenticated')

      const res = await $fetch<{ success: boolean, notifications: AppNotification[] }>(`/api/notifications/all/${authId}`)
      if (res.success) {
        notifications.value = res.notifications.map((n: any) => ({ ...n, id: Number(n.id) }))
      }
    } catch (err: any) {
      error.value = err.message ?? 'Failed to fetch notifications'
      console.error('fetchAll:', err)
    } finally {
      loading.value = false
    }
  }

  // Mark a single notification as read (does NOT delete)
  const markAsRead = async (id: number) => {
    try {
      await $fetch(`/api/notifications/read/${id}`, { method: 'POST', body: {} })
      notifications.value = notifications.value.filter(n => n.id !== id)
    } catch (err) {
      console.error('markAsRead:', err)
    }
  }

  // Mark all as read for current teacher (does NOT delete)
  const markAllAsRead = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      const authId = userData?.user?.id
      if (!authId) return

      await $fetch(`/api/notifications/readAll/${authId}`, { method: 'POST', body: {} })
      notifications.value = []
    } catch (err) {
      console.error('markAllAsRead:', err)
    }
  }

  return {
    notifications,
    loading,
    error,
    fetchUnread,
    fetchAll,
    markAsRead,
    markAllAsRead,
  }
}