import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
import {IWebsite} from "@journey-analytic/shared";

@Entity('website')
export class WebsiteEntity implements IWebsite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', length: 256 })
  title: string;
  @Column({ name: 'keywords', type: 'simple-array' })
  keywords: string[];

  @Column({ name: 'projectId', length: 64 })
  projectId: string;
  @Column({ name: 'domain', length: 128 })
  domain: string;
  @Column({ name: 'created_by', length: 32 })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
