import { defineEventHandler, readBody } from 'h3';
import { supabase } from '../supabase.js';

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  if (!email || !password) {
    return { success: false, message: 'Missing fields' };
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return { success: false, message: 'Invalid credentials' };
    }

    const { data: userData } = await supabase.from('User').select('*').eq('auth_id', data.user.id).single();

    if (userData.teacher_id) {
      setCookie(event, 'teacher_id', userData.teacher_id, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    } else if (userData.admin_id) {
      setCookie(event, 'admin_id', userData.admin_id, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    setCookie(event, 'session_token', data.session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (err) {
    return { success: false, message: 'Server error:', err };
  }
});
