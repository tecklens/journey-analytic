import {HeaderAPIKeyStrategy} from 'passport-headerapikey';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {ApiAuthSchemeEnum, HttpRequestHeaderKeysEnum, PassportStrategyEnum} from "@journey-analytic/shared";
import {AuthService} from "../auth.service";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  PassportStrategyEnum.HEADER_API_KEY,
) {
  constructor(private readonly authService: AuthService) {
    super(
      {
        header: HttpRequestHeaderKeysEnum.API_KEY,
        prefix: ApiAuthSchemeEnum.API_KEY
      },
      false,
    );
  }

  async validate(
    apiKey: string,
  ) {
    return await this.authService
      .validateApiKey(apiKey);
  }
}
