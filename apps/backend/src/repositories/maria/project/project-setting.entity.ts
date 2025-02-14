import {Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn,} from 'typeorm';

@Entity('project_setting')
export class ProjectSettingEntity {
  @PrimaryColumn({name: 'project_id'})
  projectId: string;

  @Column({name: 'status', type: 'tinyint', default: 0})
  status: number;

  @Column({name: 'users', type: 'simple-array', nullable: true})
  users: string[];

  @Index()
  @Column({name: 'created_by', length: 64, nullable: true})
  createdBy: string;
  @Column({name: 'updated_by', length: 64, nullable: true})
  updatedBy: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
}
