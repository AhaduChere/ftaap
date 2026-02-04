import { defineEventHandler, readBody } from 'h3';
import { supabase } from '../supabase.js';

export default defineEventHandler(async (event) => {
  const { token } = await readBody(event);

  if (!token) return { success: false };

  const { error } = await supabase.auth.getUser(token);

  if (error) return { success: false };

  return { success: true };
});
