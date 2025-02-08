import { UserTokenEntity } from './user-token.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {IFailedLogin, IUser, IUserResetTokenCount, UserId, UserStatus} from "@journey-analytic/shared";

@Entity('user')
@Index(['ownerOrg', 'referralBy'])
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: UserId;

  @Column({ name: 'first_name', length: 64, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', length: 64, nullable: true })
  lastName: string;

  @Index()
  @Column({ name: 'email', length: 256 })
  email: string;

  @Column({ name: 'username', length: 64, nullable: true })
  username: string;

  @Column({ name: 'profile_picture', length: 256, nullable: true })
  profilePicture: string;

  @Column({ name: 'password', length: 256, nullable: true })
  password: string;

  @Column({ name: 'job_title', length: 256, nullable: true })
  jobTitle: string;

  @Column({ name: 'bio', length: 256, nullable: true })
  bio?: string;

  @Column({ name: 'urls', type: 'simple-array', nullable: true })
  urls?: string[];

  @Column({ name: 'plan', nullable: true, default: 0 })
  plan: number;
  @Column({ name: 'status', enum: UserStatus, type: 'enum' })
  status: UserStatus;

  @Column({ name: 'billing_code', length: 64 })
  billingCode: string;
  @Column({ name: 'limit_storage', type: 'int', default: 5120 })
  limitStorage: number;

  @Column({ name: 'phone_number', length: 64, nullable: true })
  phoneNumber: string;

  @Column({ name: 'current_project_id', length: 64, nullable: true })
  currentProjectId: string;

  @Column({ name: 'current_website_id', length: 64, nullable: true })
  currentWebsiteId: string;

  @Column({ name: 'change_pass_tx_id', length: 64, nullable: true })
  changePassTxId?: string;

  @Column({
    name: 'owner_org',
    length: 64,
    nullable: true,
    default: 'admin',
    comment: 'Tổ chức tạo người dùng này',
  })
  ownerOrg: string;

  @Column({ name: 'referral_by', length: 64, nullable: true })
  referralBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'reset_token', length: 64, nullable: true })
  resetToken?: string;

  @OneToMany(() => UserTokenEntity, (token) => token.user)
  tokens: UserTokenEntity[];

  @Column({ name: 'reset_token_date', nullable: true })
  resetTokenDate?: Date;
  @Column({
    name: 'reset_token_count',
    type: 'json',
    nullable: true,
  })
  resetTokenCount?: IUserResetTokenCount;

  @Column({ name: 'failed_login', type: 'json', nullable: true })
  failedLogin?: IFailedLogin;
}
