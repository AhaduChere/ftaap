import { defineEventHandler } from 'h3';
import { supabase } from '../supabase.js';

export default defineEventHandler(async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false };
  }

  return { success: true };
});
