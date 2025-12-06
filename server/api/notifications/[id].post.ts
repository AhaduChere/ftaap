// server/api/[id].post.ts
import db from '../../../db/index';

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;
  const id = parseInt(idParam ?? '', 10);
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });

  const info = db.prepare('UPDATE StudentNotification SET read = 1 WHERE id = ?').run(id);
  return { success: info.changes > 0 };
});
