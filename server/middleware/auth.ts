import { supabase } from '../supabase';

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/')) return;
  if (event.path.startsWith('/api/notifer')) return;
  if (event.path.startsWith('/api/_nuxt_icon')) return;

  //NOTE: Check if token is right format or missing
  const authHeader = event.node.req.headers['authorization'] as string | undefined;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Session not found' });
  }

  //NOTE: Cuts out the actual token
  const token = authHeader.slice(7);

  //NOTE: Check if token is real
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }
});
