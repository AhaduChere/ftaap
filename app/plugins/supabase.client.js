import { defineNuxtPlugin } from '#app'
import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey, {
    auth: {
      storage: {
        getItem: (key) => {
          const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`))
          return match ? decodeURIComponent(match[2]) : null
        },
        setItem: (key, value) => {
          document.cookie = `${key}=${encodeURIComponent(value)}; path=/`
        },
        removeItem: (key) => {
          document.cookie = `${key}=; Max-Age=0; path=/`
        }
      }
    }
  })
  nuxtApp.provide('supabase', supabase)
})
