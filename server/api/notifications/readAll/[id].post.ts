import { supabase } from '../../../supabase.js';
import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing auth ID' });

  try {
    const { data: userData } = await supabase.from('User').select('*').eq('auth_id', id).single();

    if (!userData?.teacher_id) {
      return { success: false, message: 'Teacher not found' };
    }

    const { data: teacherData } = await supabase
      .from('Teacher')
      .select('teacher_id')
      .eq('user_id', userData.user_id)
      .single();

    if (!teacherData) {
      return { success: false, message: 'Error fetching teacher data' };
    }

    const { error } = await supabase
      .from('Student_Notification')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('teacher_id', teacherData.teacher_id)
      .eq('read', false)

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: 'Server error: ' + error };
  }
});