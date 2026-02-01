import { defineEventHandler, readBody } from 'h3';
import { supabase } from '../supabase.js';

export default defineEventHandler(async (event) => {
  const { token } = await readBody(event);

  if (!token) return { success: false };

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return { success: false };

  return { success: true, user };
});
