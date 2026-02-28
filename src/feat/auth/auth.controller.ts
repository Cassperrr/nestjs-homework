import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	Req,
	Res
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import type { Request, Response } from 'express';

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
		return this.authService.verify(res, dto);
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
		return this.authService.login(res, dto);
	}

	@ApiOperation({
		summary:
			'Генерирует новый токен доступа для верифицированного пользователя'
	})
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	public async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		return this.authService.refresh(req, res);
	}

	@ApiOperation({
		summary: 'Выход из системы'
	})
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	public async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		return this.authService.logout(req, res);
	}
}
