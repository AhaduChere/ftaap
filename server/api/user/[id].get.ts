import { supabase } from '../../supabase.js';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;
  const id = idParam;
  let user;

  const { data: role } = await supabase.from('User').select('*').eq('auth_id', id).single();

  //NOTE:Remap names for simplicity
  if (role?.role_id == 1) {
    user = await supabase.from('Admin').select('*').eq('admin_id', role?.admin_id).single();
    user = {
      ...user,
      data: {
        admin_id: user.data?.admin_id,
        user_id: user.data?.user_id,
        first_name: user.data?.admin_fname,
        last_name: user.data?.admin_lname,
      },
    };
  } else if (role?.role_id == 2) {
    user = await supabase.from('Teacher').select('*').eq('teacher_id', role?.teacher_id).single();
    user = {
      ...user,
      data: {
        teacher_id: user.data?.teacher_id,
        user_id: user.data?.user_id,
        first_name: user.data?.teacher_fname,
        last_name: user.data?.teacher_lname,
      },
    };
  }

  return { success: true, User: user.data };
});
