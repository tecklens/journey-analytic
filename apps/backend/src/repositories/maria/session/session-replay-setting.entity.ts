import {Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn,} from 'typeorm';
import {ISessionReplaySetting, SessionReplaySettingStatus} from "@journey-analytic/shared";

@Entity('session_replay_settings')
export class SessionReplaySettingEntity implements ISessionReplaySetting {
  @PrimaryColumn({name: 'project_id', length: 64})
  projectId: string;
  @PrimaryColumn({name: 'website_id', length: 64})
  websiteId: string;

  @Column({name: 'status', type: 'enum', enum: SessionReplaySettingStatus, default: SessionReplaySettingStatus.disabled})
  status: SessionReplaySettingStatus;
  @Column({name: 'users', type: 'simple-array'})
  users: string[];
  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;
  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
}
