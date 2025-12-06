import db from '../../db/index';

export default defineEventHandler(() => {
  const info = db.prepare('UPDATE StudentNotification SET read = 1 WHERE read = 0').run();
  console.log('🔍 DB update result for all notifications:', info);
  return { success: info.changes > 0 };
});
