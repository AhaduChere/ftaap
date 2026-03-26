export default defineNuxtRouteMiddleware(async (to) => {
  const { $supabase } = useNuxtApp();

  if (!$supabase) {
    return;
  }

  const {
    data: { user },
  } = await $supabase.auth.getUser();

  if (!user && to.path.toLowerCase() !== '/login' && to.path.toLowerCase() !== '/reset') {
    return navigateTo('/login');
  }
  if (user && (to.path.toLowerCase() === '/login' || to.path.toLowerCase() === '/reset')) {
    return navigateTo('/');
  }
});
