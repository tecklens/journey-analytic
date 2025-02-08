export const EventEntity = {
  fields: {
    id: 'varchar',
    eventType: 'smallint',
    projectId: 'varchar',
    sessionId: 'varchar',
    data: 'text',
    time: 'timestamp',
  },
  key: ['sessionId', 'time'],
  table_name: 'event',
};