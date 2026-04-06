import { supabase } from '../supabase';

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/')) return;
  if (event.path === '/api/notifer/') return;
  if (event.path === '/api/_nuxt_icon/') return;

  const authHeader = getHeader(event, 'authorization');

  //NOTE: Check if token is right format or missing
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Session not found', stack: undefined });
  }

  //NOTE: Cuts out the actual token
  const token = authHeader.slice(7);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  //NOTE: Check if token is real
  if (error || !user) {
    throw createError({ statusCode: 401, message: 'Unauthorized', stack: undefined });
  }

  event.context.user = user;
});
