import { supabase } from '../../../supabase.js';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const user_id = event.context.params?.id as string;
  if (!user_id) {
    return { error: 'Invalid user_id' };
  }

  const { data: user, error } = await supabase
    .from('User')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (error || !user) {
    return { error: 'User not found' };
  }

  return user;
});
