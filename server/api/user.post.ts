import { supabase } from '../supabase.js';
import { readBody, defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const firstName = body.firstName;
    const lastName = body.lastName;
    const email = body.email;
    const password = body.password;
    const role = body.role;
    const organizationId = body.organization;

    if (!firstName || !lastName || !email || !password || !role) {
      return { success: false, message: 'Missing required fields' };
    }

    const { data: authuser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
    });

    if (authError || !authuser) {
      return { success: false, message: 'Unable to create user' };
    }

    //NOTE:CREATE TEACHER BRANCH
    if (role == 'Teacher') {
      const { data: newUser } = await supabase
        .from('User')
        .insert({
          role_id: 2,
          admin_id: null,
          auth_id: authuser.user.id,
        })
        .select()
        .single();

      const { data: newTeacher } = await supabase
        .from('Teacher')
        .insert({
          teacher_fname: firstName,
          teacher_lname: lastName,
          organization_id: organizationId,
        })
        .select()
        .single();

      await supabase.from('User').update({ teacher_id: newTeacher.teacher_id }).eq('user_id', newUser.user_id);

      await supabase.from('Teacher').update({ user_id: newUser.user_id }).eq('teacher_id', newTeacher.teacher_id);
    }

    //NOTE:CREATE ADMIN BRANCH
    if (role == 'Admin') {
      const { data: newUser } = await supabase
        .from('User')
        .insert({
          role_id: 1,
          admin_id: null,
          auth_id: authuser.user.id,
        })
        .select()
        .single();

      const { data: newadmin } = await supabase
        .from('Admin')
        .insert({
          admin_fname: firstName,
          admin_lname: lastName,
        })
        .select()
        .single();

      await supabase.from('User').update({ admin_id: newadmin.admin_id }).eq('user_id', newUser.user_id);

      await supabase.from('Admin').update({ user_id: newUser.user_id }).eq('admin_id', newadmin.admin_id);
    }
    return { success: true };
  } catch (err) {
    console.log('Unexpected error creating user:', err);
    return { success: false };
  }
});
