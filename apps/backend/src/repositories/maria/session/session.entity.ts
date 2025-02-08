import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
import {ISession} from "@journey-analytic/shared";

@Entity('session')
@Index(['projectId', 'websiteId'])
export class SessionEntity implements ISession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id', length: 64 })
  projectId: string;
  @Column({ name: 'website_id', length: 64 })
  websiteId: string;

  @Column({ name: 'host', length: 256 })
  host: string;
  @Column({ name: 'browser', length: 128 })
  browser: string;
  @Column({ name: 'os', length: 128, nullable: true })
  os: string;
  @Column({ name: 'device', length: 128, nullable: true })
  device: string;
  @Column({ name: 'device_type', length: 32, nullable: true })
  deviceType: string;
  @Column({ name: 'screen', length: 128, nullable: true })
  screen: string;
  @Column({ name: 'language', length: 32, nullable: true })
  language: string;
  @Column({ name: 'country', length: 32, nullable: true })
  country: string;
  @Column({ name: 'city', length: 32, nullable: true })
  city: string;
  @Column({ name: 'share_id', length: 32, nullable: true })
  shareId: string;
  @Column({ name: 'referrer', length: 32, nullable: true })
  referrer: string;
  @Column({ name: 'cpu', length: 32, nullable: true })
  cpu: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
