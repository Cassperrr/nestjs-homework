import { RefreshToken } from '@gateway/src/common';
import { CookieService } from '@gateway/src/core';
import { AuthClientGrpc } from '@gateway/src/infra/grpc';
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
import ms from 'ms';

import {
	ApiLogin,
	ApiLogout,
	ApiRefresh,
	ApiRegister,
	ApiResend,
	ApiVerify
} from './api';
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
	public constructor(
		private readonly client: AuthClientGrpc,
		private readonly cookieService: CookieService
	) {}

	@ApiRegister()
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	public async register(
		@Body() dto: RegisterRequest
	): Promise<OtpCodeResponse> {
		return this.client.call('register', dto);
	}

	@ApiResend()
	@Post('resend')
	@HttpCode(HttpStatus.OK)
	public async resend(@Body() dto: ResendRequest): Promise<OtpCodeResponse> {
		return this.client.call('resend', dto);
	}

	@ApiVerify()
	@Patch('verify')
	@HttpCode(HttpStatus.OK)
	public async verify(
		@Res({ passthrough: true }) res: Response,
		@Body() dto: VerifyRequest
	): Promise<AccessTokenResponse> {
		const { accessToken, refreshToken, refreshTtl } =
			await this.client.call('verify', dto);

		const cookieOptions = this.cookieService.getOptions(
			refreshTtl as ms.StringValue
		);

		res.cookie('refreshToken', refreshToken, cookieOptions);

		return { accessToken };
	}

	@ApiLogin()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(
		@Res({ passthrough: true }) res: Response,
		@Body() dto: LoginRequest
	): Promise<AccessTokenResponse> {
		const { accessToken, refreshToken, refreshTtl } =
			await this.client.call('login', dto);

		const cookieOptions = this.cookieService.getOptions(
			refreshTtl as ms.StringValue
		);

		res.cookie('refreshToken', refreshToken, cookieOptions);

		return { accessToken };
	}

	@ApiRefresh()
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	public async refresh(
		@RefreshToken() storedRefreshToken: string,
		@Res({ passthrough: true }) res: Response
	): Promise<AccessTokenResponse> {
		const { accessToken, refreshToken, refreshTtl } =
			await this.client.call('refresh', {
				refreshToken: storedRefreshToken
			});

		const cookieOptions = this.cookieService.getOptions(
			refreshTtl as ms.StringValue
		);

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
		res.clearCookie('refreshToken');

		return this.client.call('logout', {
			refreshToken: storedRefreshToken
		});
	}
}
