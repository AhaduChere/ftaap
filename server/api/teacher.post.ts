import { supabase } from '../supabase.js';
import { readBody, createError, defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { firstName, lastName, userId } = body;

    if (!firstName || !lastName || !userId) {
      return { success: false, message: 'Missing fields' };
    }

    const { data: newTeacher, error } = await supabase
      .from('Teacher')
      .insert({
        user_id: userId,
        teacher_fname: firstName,
        teacher_lname: lastName,
      })
      .select()
      .single();

    if (error || !newTeacher) {
      console.error('Error creating teacher:', error);
      return { success: false, message: 'Unable to Create New User' };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error creating teacher:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create teacher',
    });
  }
});
