import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {IApiKey} from "@journey-analytic/shared";
import {UserEntity} from "../user";
import {ProjectEntity} from "../project";

@Entity('api_key')
export class ApiKeyEntity implements IApiKey {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Index()
  @Column({name: 'user_id', length: 64})
  userId: string;
  @Column({name: 'project_id', length: 64})
  projectId: string;
  @Column({name: 'hash', length: 256, type: 'varchar'})
  hash: string;
  @Index({unique: true})
  @Column({name: 'key', length: 256, type: 'varchar'})
  key: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity;

  @ManyToOne(() => ProjectEntity)
  @JoinColumn([{ name: 'project_id', referencedColumnName: 'id' }])
  project: ProjectEntity;
}
