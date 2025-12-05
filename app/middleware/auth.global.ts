import { defineNuxtRouteMiddleware, navigateTo, useCookie } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) return; //prevents hydration errors

  const sessionCookie = useCookie('session_token')?.value;
  const path = to.path.toLowerCase();

  if (sessionCookie && path === '/login') return navigateTo('/');
  if (!sessionCookie && path !== '/login') return navigateTo('/login');
});
