import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import {
  MemberRepository,
  ProjectRepository,
  UserLogRepository,
  UserRepository,
  UserTokenRepository
} from "../../repositories/maria";

const repositories = [
  UserRepository,
  UserTokenRepository,
  ProjectRepository,
  MemberRepository,
  UserLogRepository,
];

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
    TypeOrmModule.forFeature(repositories),
  ],
  providers: [UserService, ...repositories],
  controllers: [UserController],
})
export class UserModule {}
