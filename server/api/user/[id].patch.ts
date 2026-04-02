import { supabase } from '../../supabase.js';

export default defineEventHandler(async (event) => {
  const authId = event.context.params?.id;
  const { first_name, last_name } = await readBody(event);

  try {
    const { data, error } = await supabase.from('User').select('role_id, user_id').eq('auth_id', authId).single();

    if (error) return { success: false, message: error.message };

    if (data?.role_id === 1) {
      const { error: updateErr } = await supabase
        .from('Admin')
        .update({
          admin_fname: first_name,
          admin_lname: last_name,
        })
        .eq('user_id', data.user_id);

      if (updateErr) return { success: false, message: updateErr.message };
    } else {
      const { error: updateErr } = await supabase
        .from('Teacher')
        .update({
          teacher_fname: first_name,
          teacher_lname: last_name,
        })
        .eq('user_id', data.user_id);

      if (updateErr) return { success: false, message: updateErr.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, message: 'Server error', error: err };
  }
});
