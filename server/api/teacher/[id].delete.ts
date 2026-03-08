import { supabase } from '../../supabase.js';

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'));

    const { error: studentError } = await supabase.from('Student').update({ teacher_id: null }).eq('teacher_id', id);

    if (studentError) return { success: false, message: studentError.message };

    const { error: userError } = await supabase.from('User').delete().eq('teacher_id', id);

    if (userError) return { success: false, message: userError.message };

    const { error } = await supabase.from('Teacher').delete().eq('teacher_id', id);

    if (error) return { success: false, message: error.message };

    return { success: true };
  } catch (err) {
    return { success: false, message: 'Server error', err };
  }
});
