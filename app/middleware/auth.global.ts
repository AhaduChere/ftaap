export default defineNuxtRouteMiddleware(async (to) => {
  const { $supabase } = useNuxtApp();
  if (!$supabase) return;

  const { data: { user } } = await $supabase.auth.getUser();
  const path = to.path.toLowerCase();
  const isAuthPage = path === '/login' || path === '/reset';

  if (!user && !isAuthPage) return navigateTo('/login');
  if (user && isAuthPage) return navigateTo('/');
});
