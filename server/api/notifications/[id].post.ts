import { supabase } from '~/utils/supabase';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Notification ID is required'
    });
  }

  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', Number(id));

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('Error marking notification as read:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to mark notification as read'
    });
  }
});
