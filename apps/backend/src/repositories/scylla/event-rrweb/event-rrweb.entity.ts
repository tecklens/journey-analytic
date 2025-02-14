export const EventRrwebEntity = {
  fields: {
    id: 'bigint',
    sessionId: 'varchar',
    events: 'text',
    time: 'timestamp',
  },
  table_options: {
    default_time_to_live: 1209600 // 14 ngày = 1209600 giây
  },
  key: ['sessionId', 'time'],
  table_name: 'RrWebEvent',
};