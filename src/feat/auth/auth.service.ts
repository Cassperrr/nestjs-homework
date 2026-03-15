import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	Logger,
	UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { CookieOptions } from 'express';
import ms from 'ms';
import { Role } from 'prisma/generated/enums';
import { EnvTypes } from 'src/config';
import {
	AccountRepository,
	CACHE_EVENTS,
	HASH_SERVICE,
	HashService,
	OTP_SERVICE,
	OtpService,
	SESSION_SERVICE,
	SessionService,
	TOKEN_SERVICE,
	TokenService
} from 'src/core';
import { OtpKey } from 'src/shared';

import type {
	LoginRequest,
	OtpCodeResponse,
	RegisterRequest,
	ResendRequest,
	VerifyRequest
} from './dto';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);
	private readonly COOKIE_DOMAIN: string;
	private readonly isDev: boolean;

	public constructor(
		private readonly configService: ConfigService<EnvTypes, true>,
		private readonly accountRepo: AccountRepository,
		private readonly eventEmmiter: EventEmitter2,

		@Inject(HASH_SERVICE) private readonly hashService: HashService,
		@Inject(OTP_SERVICE) private readonly otpService: OtpService,
		@Inject(TOKEN_SERVICE)
		private readonly tokenService: TokenService,
		@Inject(SESSION_SERVICE) private readonly session: SessionService
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

		const account = await this.accountRepo.findBy({ email, username });

		if (account)
			throw new ConflictException(
				'Аккаунт с такими данными уже существует'
			);

		const hash = await this.hashService.hash(password);

		const { id, role } = await this.accountRepo.create({
			email,
			username,
			password: hash
		});

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(`[${id}] [${role}] Аккаунт зарегистрирован`);

		return this.otpService.generate(id, OtpKey.EMAIL);
	}

	public async resend(dto: ResendRequest): Promise<OtpCodeResponse> {
		const { email } = dto;

		const account = await this.accountRepo.findBy({ email });

		if (!account || account.isVerified || account.deletedAt)
			throw new BadRequestException(
				'Аккаунт с такой почтой либо не существует, либо он верифицирован'
			);

		this.logger.log(
			`[${account.id}] [${account.role}] Перевыпуск OTP кода`
		);

		return this.otpService.generate(account.id, OtpKey.EMAIL);
	}

	public async verify(dto: VerifyRequest) {
		const { email, code } = dto;

		const account = await this.accountRepo.findBy({ email });

		if (!account || account.isVerified || account.deletedAt)
			throw new BadRequestException(
				'Аккаунт с такой почтой либо не существует, либо он верифицирован'
			);

		await this.otpService.verify(account.id, code, OtpKey.EMAIL);

		const patched = await this.accountRepo.update(account.id, {
			isVerified: true
		});

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(
			`[${account.id}] [${account.role}] Аккаунт верифицирован`
		);

		return this._authenticate(patched.id, patched.role);
	}

	public async login(dto: LoginRequest) {
		const { username, password } = dto;

		const account = await this.accountRepo.findBy({ username });

		if (!account || !account.isVerified || account.deletedAt)
			throw new UnauthorizedException('Неверный логин или пароль');

		const isValidPassword = await this.hashService.verify(
			account.password,
			password
		);

		if (!isValidPassword)
			throw new UnauthorizedException('Неверный логин или пароль');

		this.logger.log(`[${account.id}] [${account.role}] Вход в систему`);

		return this._authenticate(account.id, account.role);
	}

	public async refresh(refreshToken: string) {
		const { id } = this.tokenService.verify(refreshToken);

		const storedToken = await this.session.get(id);
		if (!storedToken || refreshToken !== storedToken)
			throw new UnauthorizedException('Время сессии истекло');

		const account = await this.accountRepo.findBy({ id });

		if (!account || account.deletedAt)
			throw new UnauthorizedException('Недействительный токен');

		this.logger.log(`[${account.id}] [${account.role}] Обновление сессии`);

		return this._authenticate(account.id, account.role);
	}

	public async logout(refreshToken: string) {
		try {
			const { id, role } = this.tokenService.verify(refreshToken);

			await this.session.delete(id);

			this.logger.log(`[${id}] [${role}] Выход из системы`);
		} catch {
			// ignore
		}

		return { message: 'Выход выполнен' };
	}

	private async _authenticate(id: string, role: Role) {
		const { accessToken, refreshToken, refreshTtl } =
			this.tokenService.signTokens({ id, role });

		await this.session.set(id, refreshToken);

		const cookieOptions: CookieOptions = {
			httpOnly: true,
			expires: new Date(Date.now() + ms(refreshTtl)),
			secure: !this.isDev,
			sameSite: 'lax',
			...(this.isDev ? {} : { domain: this.COOKIE_DOMAIN })
		};

		return { accessToken, refreshToken, cookieOptions };
	}
}
