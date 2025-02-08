import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BullModule} from '@nestjs/bullmq';
import {
  UserRepository,
  UserTokenRepository,
  ProjectRepository,
  MemberRepository,
  UserActivityRepository,
  ApiKeyRepository
} from "../../repositories/maria";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ApiKeyStrategy, JwtStrategy, RefreshJwtStrategy} from "./strategy";

const repositories = [
  UserRepository,
  UserTokenRepository,
  ProjectRepository,
  MemberRepository,
  UserActivityRepository,
  ApiKeyRepository,
];

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {expiresIn: '2 hours'}, // * 1 tiếng
      })
    }),
    TypeOrmModule.forFeature(repositories),
    BullModule.registerQueue({
      name: 'send-email',
    }),
  ],
  providers: [AuthService, JwtStrategy, ApiKeyStrategy, RefreshJwtStrategy, ...repositories],
  controllers: [AuthController],
  exports: [ApiKeyStrategy, JwtStrategy, AuthService]
})
export class AuthModule {
}
