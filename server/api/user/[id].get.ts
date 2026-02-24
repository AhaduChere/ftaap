import { supabase } from '../../supabase.js';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;
  const id = idParam;
  try {
    const { data: role } = await supabase.from('User').select('*').eq('auth_id', id).single();
    if (role?.role_id == 1) {
      const { data: user } = await supabase.from('Admin').select('*').eq('admin_id', role?.admin_id).single();
    } else if (role?.role_id == 2) {
      const { data: user } = await supabase.from('Teacher').select('*').eq('teacher_id', role?.teacher_id).single();
    }

    return { success: true, User: user };
  } catch (error) {
    return { success: false, message: 'Server error:' + error };
  }
});
