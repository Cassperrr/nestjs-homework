import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import ms from 'ms';
import { EnvTypes } from 'src/config';
import {
	HASH_SERVICE,
	HashService,
	JWT_TOKEN_SERVICE,
	JwtTokenService,
	OTP_SERVICE,
	OtpService,
	SESSION_SERVICE,
	SessionService
} from 'src/core';
import { AccountRepository } from 'src/infra';
import { OtpKey } from 'src/shared';

import type {
	AccessTokenResponse,
	LoginRequest,
	OtpCodeResponse,
	RegisterRequest,
	ResendRequest,
	VerifyRequest
} from './dto';

@Injectable()
export class AuthService {
	private readonly COOKIE_DOMAIN: string;
	private readonly isDev: boolean;

	public constructor(
		@Inject(HASH_SERVICE) private readonly hashService: HashService,
		@Inject(OTP_SERVICE) private readonly otpService: OtpService,
		@Inject(JWT_TOKEN_SERVICE) private readonly jwtService: JwtTokenService,
		@Inject(SESSION_SERVICE) private readonly session: SessionService,

		private readonly configService: ConfigService<EnvTypes, true>,
		private readonly accountRepo: AccountRepository
	) {
		this.COOKIE_DOMAIN = configService.get('COOKIE_DOMAIN', {
			infer: true
		});
		this.isDev =
			this.configService.get('NODE_ENV', { infer: true }) ===
			'development';
	}

	public async register(dto: RegisterRequest): Promise<OtpCodeResponse> {
		const { email, username, password } = dto;

		const existing = await this.accountRepo.findByEmailOrUsername(
			email,
			username
		);

		if (existing)
			throw new ConflictException(
				'Аккаунт с такими данными уже существует'
			);

		const hash = await this.hashService.hash(password);
		const id = await this.accountRepo.create(email, username, hash);

		return this.otpService.generate(id, OtpKey.EMAIL);
	}

	public async resend(dto: ResendRequest): Promise<OtpCodeResponse> {
		const { email } = dto;

		const account = await this.accountRepo.findByEmail(email);

		if (!account || account.isVerified)
			throw new BadRequestException(
				'Аккаунт с такой почтой либо не существует, либо он верифицирован'
			);

		return this.otpService.generate(account.id, OtpKey.EMAIL);
	}

	public async verify(
		res: Response,
		dto: VerifyRequest
	): Promise<AccessTokenResponse> {
		const { email, code } = dto;

		const account = await this.accountRepo.findByEmail(email);

		if (!account || account.isVerified)
			throw new BadRequestException(
				'Аккаунт с такой почтой либо не существует, либо он верифицирован'
			);

		await this.otpService.verify(account.id, code, OtpKey.EMAIL);

		const patched = await this.accountRepo.update(account.id, {
			isVerified: true
		});

		return this._authenticate(res, patched.id);
	}

	public async login(
		res: Response,
		dto: LoginRequest
	): Promise<AccessTokenResponse> {
		const { username, password } = dto;

		const account = await this.accountRepo.findByUsername(username);

		if (!account || !account.isVerified)
			throw new UnauthorizedException('Неверный логин или пароль');

		const isValidPassword = await this.hashService.verify(
			account.password,
			password
		);

		if (!isValidPassword)
			throw new UnauthorizedException('Неверный логин или пароль');

		return this._authenticate(res, account.id);
	}

	public async refresh(req: Request, res: Response) {
		const refreshToken = req.cookies['refreshToken'];
		if (!refreshToken) throw new UnauthorizedException('Токен не найден');
		const { id } = this.jwtService.verify(refreshToken);

		const storedToken = await this.session.get(id);
		if (!storedToken || refreshToken !== storedToken)
			throw new UnauthorizedException('Время сессии истекло');

		const account = await this.accountRepo.findById(id);
		if (!account) throw new UnauthorizedException('Недействительный токен');

		return this._authenticate(res, account.id);
	}

	public async logout(req: Request, res: Response) {
		const refreshToken = req.cookies['refreshToken'];

		if (refreshToken) {
			try {
				const { id } = this.jwtService.verify(refreshToken);
				await this.session.delete(id);
			} catch {}
		}

		res.clearCookie('refreshToken');
		return { message: 'Выход выполнен' };
	}

	private async _authenticate(res: Response, id: string) {
		const { accessToken, refreshToken, refreshTtl } =
			this.jwtService.signTokens({ id });

		await this.session.set(id, refreshToken);

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			expires: new Date(Date.now() + ms(refreshTtl)),
			secure: !this.isDev,
			sameSite: 'lax',
			...(this.isDev ? {} : { domain: this.COOKIE_DOMAIN })
		});

		return { accessToken };
	}
}
