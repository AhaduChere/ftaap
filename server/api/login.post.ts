import { defineEventHandler, readBody, setCookie } from 'h3';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabase.js';

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  if (!username || !password) {
    return { success: false, message: 'Missing fields' };
  }

  try {
    const { data: user, error } = await supabase
      .from('User')
      .select('user_id, role_id')
      .eq('username', username)
      .eq('encrypted_password', password)
      .single();

    if (error || !user) {
      return { success: false, message: 'Invalid credentials' };
    }

    const numericRole = user.role_id || 0;

    const token = jwt.sign({ user_id: user.user_id, role: numericRole }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    setCookie(event, 'session_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, role: numericRole };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Server error' };
  }
});
