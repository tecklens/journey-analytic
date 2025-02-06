import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Header,
    Logger,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {GoogleOAuthGuard, JwtAuthGuard, RefreshAuthGuard,} from './strategy';
import {AuthService} from './auth.service';
import * as process from 'process';
import {LoginBodyDto, PasswordResetBodyDto, UserRegistrationBodyDto,} from './dtos';
import {ApiException, buildGoogleOauthRedirectUrl, UserSession} from '../../types';
import {IJwtPayload} from '@journey-analytic/shared';
import {Fingerprint, IFingerprint} from 'nestjs-fingerprint';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Get('/google/check')
    checkGoogleAuth() {
        Logger.verbose('Checking Google Auth');

        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            throw new ApiException(
                'Google auth is not configured, please provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET as env variables',
            );
        }

        Logger.verbose('Google Auth has all variables.');

        return {
            success: true,
        };
    }

    @Get('/google')
    @UseGuards(GoogleOAuthGuard)
    async googleAuth() {
    }

    @Get('/google/callback')
    @UseGuards(GoogleOAuthGuard)
    async googleCallback(@Req() request: any, @Res() response: any) {
        const url = buildGoogleOauthRedirectUrl(request);

        return response.redirect(url);
    }

    @Get('/refresh')
    @UseGuards(RefreshAuthGuard)
    @ApiBearerAuth()
    @Header('Cache-Control', 'no-store')
    refreshToken(@UserSession() user: IJwtPayload) {
        if (!user || !user.id) throw new BadRequestException();

        return this.authService.generateTokenPair(user);
    }

    @Post('/register')
    @Header('Cache-Control', 'no-store')
    async userRegistration(
        @UserSession() user: IJwtPayload,
        @Body() body: UserRegistrationBodyDto,
        @Fingerprint() fp: IFingerprint,
    ) {
        return await this.authService.userRegistration(user, body, fp);
    }

    @Post('/reset/request')
    @Header('Cache-Control', 'no-store')
    async forgotPasswordRequest(@Body() body: { email: string }) {
        return await this.authService.resetPassword(body);
    }

    @Post('/reset')
    @Header('Cache-Control', 'no-store')
    async passwordReset(@Body() body: PasswordResetBodyDto) {
        return await this.authService.passwordReset(body);
    }

    @Post('/login')
    @Header('Cache-Control', 'no-store')
    async userLogin(@Body() body: LoginBodyDto, @Fingerprint() fp: IFingerprint) {
        return await this.authService.login(body, fp);
    }

    @Post('/project/:projectId/switch')
    @UseGuards(JwtAuthGuard)
    async storeSwitch(
        @UserSession() user: IJwtPayload,
        @Param('projectId') projectId: string,
    ): Promise<{ token: string; refreshToken: string }> {
        return await this.authService.switchProject({
            userId: user.id,
            newProjectId: projectId,
        });
    }
}
