export default defineNuxtRouteMiddleware(async (to) => {
  const { $supabase } = useNuxtApp();

  if (!$supabase) {
    return;
  }

  const {
    data: { user },
  } = await ($supabase as any).auth.getUser();

  if (!user && to.path !== '/login') {
    return navigateTo('/login');
  }

  if (user && to.path === '/login') {
    return navigateTo('/');
  }
});
