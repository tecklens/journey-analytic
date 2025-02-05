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
  @Column({ name: 'os', length: 128 })
  os: string;
  @Column({ name: 'device', length: 128 })
  device: string;
  @Column({ name: 'screen', length: 128 })
  screen: string;
  @Column({ name: 'language', length: 32 })
  language: string;
  @Column({ name: 'country', length: 32 })
  country: string;
  @Column({ name: 'city', length: 32 })
  city: string;
  @Column({ name: 'share_id', length: 32 })
  shareId: string;
  @Column({ name: 'referrer', length: 32 })
  referrer: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
