import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
import {AuthProviderEnum, IUser, IUserToken, UserTokenId} from "@journey-analytic/shared";
import {UserEntity} from "./user.entity";

@Entity('user_token')
export class UserTokenEntity implements IUserToken {
  @PrimaryGeneratedColumn('uuid')
  id: UserTokenId;

  @Column({name: 'user_id', length: 64})
  userId: string;

  @Column({name: 'token', length: 128})
  token: string;

  @Column({name: 'refresh_token', length: 128})
  refreshToken: string;

  @Column({name: 'provider', type: 'enum', enum: AuthProviderEnum, nullable: true})
  provider: AuthProviderEnum;

  @Column({name: 'provider_id', length: 16, nullable: true})
  providerId: string;

  @Column({name: 'valid', nullable: true})
  valid: boolean;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.tokens)
  user: IUser;
}
