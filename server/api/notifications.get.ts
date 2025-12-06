import db from '../../db/index.js';

export default defineEventHandler(() => {
  const notifications = db.prepare(`
    SELECT *
    FROM StudentNotification
    WHERE read = 0
    ORDER BY 
      CASE level
        WHEN 'red' THEN 0
        WHEN 'yellow' THEN 1
        WHEN 'green' THEN 2
      END ASC,
      timestamp DESC
  `).all();

  console.log('📦 Returned:', notifications.length, 'notifications');
  return notifications;
});
