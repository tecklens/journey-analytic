import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {PassportStrategyEnum} from "@journey-analytic/shared";

@Injectable()
export class JwtAuthGuard extends AuthGuard(PassportStrategyEnum.JWT) {}
