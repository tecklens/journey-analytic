import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
import {IProject} from "@journey-analytic/shared";

@Entity('project')
export class ProjectEntity implements IProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 64, nullable: true })
  name: string;

  @Index()
  @Column({ name: 'website', length: 256 })
  website: string;

  @Column({ name: 'tags', type: 'simple-array', nullable: true })
  tags: string[];

  @Index()
  @Column({ name: 'created_by', length: 64, nullable: true })
  createdBy: string;
  @Column({ name: 'updated_by', length: 64, nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
