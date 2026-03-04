import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	Res
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { RefreshToken } from 'src/common';

import { AuthService } from './auth.service';
import {
	AccessTokenResponse,
	LoginRequest,
	OtpCodeResponse,
	RegisterRequest,
	ResendRequest,
	VerifyRequest
} from './dto';

@Controller('auth')
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@ApiOperation({
		summary: 'Регистрация аккаунта'
	})
	@ApiOkResponse({ type: OtpCodeResponse })
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	public async register(@Body() dto: RegisterRequest) {
		return this.authService.register(dto);
	}

	@ApiOperation({
		summary: 'Отправить OTP код заново'
	})
	@ApiOkResponse({ type: OtpCodeResponse })
	@Post('resend')
	@HttpCode(HttpStatus.OK)
	public async resend(@Body() dto: ResendRequest) {
		return this.authService.resend(dto);
	}

	@ApiOperation({
		summary: 'Верификация аккаунта'
	})
	@ApiOkResponse({ type: AccessTokenResponse })
	@Patch('verify')
	@HttpCode(HttpStatus.OK)
	public async verify(
		@Res({ passthrough: true }) res: Response,
		@Body() dto: VerifyRequest
	) {
		const { accessToken, refreshToken, cookieOptions } =
			await this.authService.verify(dto);

		res.cookie('refreshToken', refreshToken, cookieOptions);

		return { accessToken };
	}

	@ApiOperation({
		summary: 'Вход в аккаунт для верифицированного пользователя'
	})
	@ApiOkResponse({ type: AccessTokenResponse })
	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(
		@Res({ passthrough: true }) res: Response,
		@Body() dto: LoginRequest
	) {
		const { accessToken, refreshToken, cookieOptions } =
			await this.authService.login(dto);

		res.cookie('refreshToken', refreshToken, cookieOptions);

		return { accessToken };
	}

	@ApiOperation({
		summary:
			'Генерирует новый токен доступа для верифицированного пользователя'
	})
	@ApiOkResponse({ type: AccessTokenResponse })
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	public async refresh(
		@RefreshToken() storedRefreshToken: string,
		@Res({ passthrough: true }) res: Response
	) {
		const { accessToken, refreshToken, cookieOptions } =
			await this.authService.refresh(storedRefreshToken);

		res.cookie('refreshToken', refreshToken, cookieOptions);

		return { accessToken };
	}

	@ApiOperation({
		summary: 'Выход из системы'
	})
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	public async logout(
		@RefreshToken() storedRefreshToken: string,
		@Res({ passthrough: true }) res: Response
	) {
		const msg = await this.authService.logout(storedRefreshToken);

		res.clearCookie('refreshToken');

		return msg;
	}
}
