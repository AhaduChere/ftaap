export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) return;

  const path = to.path.toLowerCase();
  const token = useCookie('session_token').value;

  const { success } = await $fetch<{ success: boolean }>('/api/auth', {
    method: 'POST',
    body: { token },
  });

  if (!success) {
    useCookie('session_token').value = '';
    if (path !== '/login') return navigateTo('/login');
  } else if (path === '/login') {
    return navigateTo('/');
  }
});
