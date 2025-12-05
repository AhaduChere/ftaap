import { supabase } from '~/utils/supabase';
import type { StudentNotification } from '../../types/notifications';

export default defineEventHandler(async (event) => {
  try {
    const { data, error } = await supabase
      .from<StudentNotification>('notifications')
      .select('*')
      .eq('read', false)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.error('Error fetching notifications:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch notifications'
    });
  }
});