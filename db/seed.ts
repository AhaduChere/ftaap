import db from './index.ts';

const initialNotifications = [
  { name: 'Dan Daniels', level: 'red', message: 'Dropped from Yellow to Red', timestamp: new Date().toISOString(), read: 0 },
  { name: 'Eli Elliot', level: 'red', message: 'Dropped from Yellow to Red', timestamp: new Date().toISOString(), read: 0 },
  { name: 'Jenny Jenson', level: 'red', message: 'Dropped from Yellow to Red', timestamp: new Date().toISOString(), read: 0 },
  { name: 'Joe Jones', level: 'red', message: 'Dropped from Yellow to Red', timestamp: new Date().toISOString(), read: 0 },
  { name: 'Peter Peterson', level: 'red', message: 'Dropped from Yellow to Red', timestamp: new Date().toISOString(), read: 0 },
];

// Clear old notifications and seed
db.prepare('DELETE FROM StudentNotification').run();

const insert = db.prepare(`
  INSERT INTO StudentNotification (name, level, message, timestamp, read)
  VALUES (@name, @level, @message, @timestamp, @read)
`);

initialNotifications.forEach(n => insert.run(n));

console.log('✅ Seeded notifications into dev.db.');
