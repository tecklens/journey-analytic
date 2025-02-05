import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { PassportStrategyEnum } from '@reakestate/stateless';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard(PassportStrategyEnum.GOOGLE) {
  constructor(private configService: ConfigService) {
    super({
      accessType: 'offline',
    });
  }
}
