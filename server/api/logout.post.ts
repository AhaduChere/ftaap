import { defineEventHandler, deleteCookie } from 'h3';
import { supabase } from '../supabase.js';

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'session_token', {
    path: '/',
  });

  deleteCookie(event, 'admin_id', {
    path: '/',
  });

  deleteCookie(event, 'teacher_id', {
    path: '/',
  });
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.alert(error);
    return { success: false };
  }

  return { success: true };
});
