import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { secret } from '@config/env';
import { AuthService } from '../auth.service';
import {PassportStrategyEnum} from "@journey-analytic/shared";

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  PassportStrategyEnum.JWT,
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
