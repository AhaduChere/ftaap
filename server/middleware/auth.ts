import { supabase } from '../supabase';
export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/')) return;
  if (event.path === '/api/notifer/') return;

  const cookies = parseCookies(event)
  const raw = Object.entries(cookies)
    .find(([key]) => key.startsWith('sb-'))?.[1]

  if (!raw) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const session = JSON.parse(raw)
  const token = session.access_token

  const { data: { user } } = await supabase.auth.getUser(token)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  event.context.user = user;
});
