import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {UserId, MemberStatus, IMember, IUser} from "@journey-analytic/shared";
import {UserEntity} from "../user";

@Entity('member')
export class MemberEntity implements IMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', length: 64 })
  userId: UserId;

  @Index()
  @Column({ name: 'project_id', length: 64 })
  projectId: string;

  @Column({ name: 'roles', type: 'simple-array', nullable: true })
  roles: string[];

  @Column({
    name: 'status',
    type: 'enum',
    enum: MemberStatus,
  })
  status: MemberStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: IUser;
}
