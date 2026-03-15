import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	Res
} from '@nestjs/common';
import type { Response } from 'express';
import { RefreshToken } from 'src/common';

import {
	ApiLogin,
	ApiLogout,
	ApiRefresh,
	ApiRegister,
	ApiResend,
	ApiVerify
} from './api';
import { AuthService } from './auth.service';
import {
	LoginRequest,
	RegisterRequest,
	ResendRequest,
	VerifyRequest
} from './dto';

@Controller('auth')
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@ApiRegister()
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	public async register(@Body() dto: RegisterRequest) {
		return this.authService.register(dto);
	}

	@ApiResend()
	@Post('resend')
	@HttpCode(HttpStatus.OK)
	public async resend(@Body() dto: ResendRequest) {
		return this.authService.resend(dto);
	}

	@ApiVerify()
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

	@ApiLogin()
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

	@ApiRefresh()
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

	@ApiLogout()
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
