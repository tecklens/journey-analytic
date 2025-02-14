export const EventEntity = {
  fields: {
    id: 'varchar',
    eventType: 'smallint',
    eventKey: 'varchar',
    projectId: 'varchar',
    websiteId: 'varchar',
    sessionId: 'varchar',
    data: 'text',
    time: 'timestamp',
  },
  key: ['sessionId', 'time'],
  table_name: 'event',
};