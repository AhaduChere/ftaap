import { supabase } from '../../../supabase.js';
import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;
  if (!idParam) throw createError({ statusCode: 400, statusMessage: 'Missing ID' });

  const id = Number(idParam);

  const { error } = await supabase
    .from('Student_Notification')
    .update({
      read: true,
      read_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { success: true };
});