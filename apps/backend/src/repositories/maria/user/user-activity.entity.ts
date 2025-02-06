import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';

@Entity('user_activity')
export class UserActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', length: 64 })
  userId: string;

  @Column({ name: 'project_id', length: 64 })
  projectId: string;

  @Column({ name: 'type', length: 128 })
  type: string;

  @Column({ name: 'fingerprint_id', length: 64, nullable: true })
  fingerprintId: string;

  @Column({ name: 'headers', length: 256, nullable: true })
  headers: string;

  @Column({ name: 'os', length: 256, nullable: true })
  os: string;

  @Column({ name: 'ip', length: 256, nullable: true })
  ip: string;

  @Column({ name: 'user_agent', length: 512, nullable: true })
  userAgent: string;

  @Column({ name: 'addition_info', length: 512, nullable: true })
  additionInfo: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
