import { supabase } from '../supabase.js';
import { readBody, createError, defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username, password, email, roleId } = body;

    if (!username || !password || !email || !roleId) {
      return { success: false, message: 'Missing fields' };
    }

    // Check if username already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('User')
      .select('*')
      .or(`username.eq.${username},email.eq.${email}`)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to check existing user',
      });
    }

    if (existingUser) {
      return { success: true };
    }

    // Create the new user
    const { data: newUser, error: insertError } = await supabase
      .from('User')
      .insert({
        username,
        email,
        encrypted_password: password,
        role_id: roleId,
      })
      .select()
      .single();

    if (insertError || !newUser) {
      console.error('Error creating user:', insertError);
      return { success: false, message: 'Unable to Create New User' };
    }

    return { success: true, user: { user_id: newUser.user_id } };
  } catch (err) {
    console.error('Unexpected error creating user:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user',
    });
  }
});
