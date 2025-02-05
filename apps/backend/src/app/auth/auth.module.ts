import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '@repository/user/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { secret } from '@config/env';
import { UserActivityRepository, UserTokenRepository } from '@repository/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy, RefreshJwtStrategy } from '@app/auth/strategy';
import { StoreRepository } from '@repository/store';
import { MemberRepository } from '@repository/member';
import { PermissionRepository, RoleRepository } from '@repository/role';
import { BullModule } from '@nestjs/bullmq';

const repositories = [
  UserRepository,
  UserTokenRepository,
  StoreRepository,
  MemberRepository,
  RoleRepository,
  PermissionRepository,
  UserActivityRepository,
];

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: secret,
      signOptions: { expiresIn: '2 hours' }, // * 1 tiếng
    }),
    TypeOrmModule.forFeature(repositories),
    BullModule.registerQueue({
      name: 'send-email',
    }),
  ],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy, ...repositories],
  controllers: [AuthController],
})
export class AuthModule {}
