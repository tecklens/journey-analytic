import {Column, Entity} from 'nestjs-cassandra';
import {EventType, IEvent} from "@journey-analytic/shared";

@Entity({
  table_name: 'event',
  key: ['id'],
})
export class EventEntity implements IEvent {
  @Column({
    type: 'varchar'
  })
  id: string;

  @Column({
    type: 'tinyint',
  })
  eventType: EventType;

  @Column({
    type: 'varchar',
  })
  projectId: string;
  @Column({
    type: 'varchar',
  })
  sessionId: string;

  @Column({
    type: 'tuple',
  })
  data?: string;

  @Column({
    type: 'time',
  })
  time: number;
}