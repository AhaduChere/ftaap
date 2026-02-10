import { supabase } from '../supabase.js';
import { readBody, createError, defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { firstName, lastName, email, password, organizationId, role } = body;

    if (!firstName || !lastName || !email || !password) {
      return { success: false, message: 'Missing required fields' };
    }

    // const { data: Authuser, error: authError } = await supabase.auth.admin.createUser({
    //   email,
    //   password,
    //   email_confirm: true,
    // });
    //
    // if (authError || !Authuser) {
    //   return { success: false, message: 'Unable to create user' };
    // }

    // const { data: newUser, error: userError } = await supabase
    //   .from('User')
    //   .insert({
    //     auth_id: authUser.id,
    //     role_id: role === 'Teacher' ? 2 : 1,
    //   })

    // if (userError || !newUser) {
    //   return { success: false, message: 'Unable to create user record' };
    // }
    //
    if (role == 'Teacher') {
      console.log(role);
    }

    if (role == 'Admin') {
      console.log(role);
    }

    return { success: true };
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create teacher',
    });
  }
});
