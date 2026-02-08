import { supabase } from '../../supabase.js';

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;
  if (!idParam) throw createError({ statusCode: 400, statusMessage: 'Missing ID' });

  const id = Number(idParam); 
  const {data, error} = await supabase
  .from('Student_Notification')
  .delete()
  .eq('id', id)

  if(error){
    throw createError({statusCode: error.statusCode, message: error.message});
    return {success: false};
  }

  return { success: true};
});
