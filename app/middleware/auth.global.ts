export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) return;

  const token = useCookie('session_token').value;
  const path = to.path.toLowerCase();

  if (!token) {
    if (path !== '/login' && path !== '/teacher') return navigateTo('/login');
    return;
  }

  if (path === '/login' || path === '/teacher') return navigateTo('/');
});
