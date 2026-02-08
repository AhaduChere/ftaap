import { supabase } from '../../../supabase.js';
import { defineEventHandler, createError } from 'h3';

async function getTeacherEmail(user_id: string) {
  if (!user_id) return null;

  const { data: user, error } = await supabase
    .from('User')
    .select('email')
    .eq('user_id', user_id)
    .single();

  if (error || !user) {
    console.error('Failed to fetch user:', error);
    return null;
  }

  return user.email;
}

export default defineEventHandler(async (event) => {
  const teacher_id = Number(event.context.params?.id);
  if (!teacher_id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid ID' });
  }

  const { data: teacher, error } = await supabase
    .from('Teacher')
    .select('user_id')
    .eq('teacher_id', teacher_id)
    .single();

  if (error || !teacher) {
    throw createError({ statusCode: 404, statusMessage: 'Record not found' });
  }

  if (!teacher.user_id) {
    return 'Teacher has no user_id';
  }

  const teacherEmail = await getTeacherEmail(teacher.user_id);
  return teacherEmail;
});
