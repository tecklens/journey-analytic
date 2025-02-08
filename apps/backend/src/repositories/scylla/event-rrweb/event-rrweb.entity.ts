export const EventRrwebEntity = {
  fields: {
    id: 'bigint',
    sessionId: 'varchar',
    events: 'text',
    time: 'timestamp',
  },
  table_options: {
    default_time_to_live: 604800 // 7 ngày = 604800 giây
  },
  key: ['sessionId', 'time'],
  table_name: 'RrWebEvent',
};