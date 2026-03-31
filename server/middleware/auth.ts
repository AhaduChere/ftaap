// import { supabase } from '../supabase';

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/')) return;
  if (event.path === '/api/notifer/') return;

  // const cookies = parseCookies(event);
  // const config = useRuntimeConfig();
  // const authkey = config.authkey;

  // const raw = Object.entries(cookies).find(([key]) => key === authkey);
  // const token = raw ? raw[1] : null;
  //
  // if (!token) {
  //   throw createError({ statusCode: 401, message: 'Unauthorized' });
  // }
  //
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser(token);
  //
  // if (!user) {
  //   throw createError({ statusCode: 401, message: 'Unauthorized' });
  // }

  // event.context.user = user;
});
