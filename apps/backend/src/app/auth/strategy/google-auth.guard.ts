import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import {PassportStrategyEnum} from "@journey-analytic/shared";

@Injectable()
export class GoogleOAuthGuard extends AuthGuard(PassportStrategyEnum.GOOGLE) {
  constructor(configService: ConfigService) {
    super({
      accessType: 'offline',
    });
  }
}
