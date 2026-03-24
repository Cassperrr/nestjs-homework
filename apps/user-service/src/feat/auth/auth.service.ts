import { GrpcStatus } from '@libs/grpc';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RpcException } from '@nestjs/microservices';
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
} from '@user-service/src/core';
import type {
	LoginRequest,
	RefreshRequest,
	RegisterRequest,
	ResendRequest,
	TokensResponse,
	VerifyRequest
} from 'contracts/gen/auth';
import type { OtpCodeResponse, StringMessage } from 'contracts/gen/shared';
import { OtpKey, Role } from 'shared';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	public constructor(
		private readonly accountRepo: AccountRepository,
		private readonly eventEmmiter: EventEmitter2,

		@Inject(HASH_SERVICE) private readonly hashService: HashService,
		@Inject(OTP_SERVICE) private readonly otpService: OtpService,
		@Inject(TOKEN_SERVICE)
		private readonly tokenService: TokenService,
		@Inject(SESSION_SERVICE) private readonly session: SessionService
	) {}

	public async register(data: RegisterRequest): Promise<OtpCodeResponse> {
		const { email, username, password } = data;

		const account = await this.accountRepo.findBy({ email, username });

		if (account)
			throw new RpcException({
				code: GrpcStatus.ALREADY_EXISTS,
				details: 'Аккаунт с такими данными уже существует'
			});

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

	public async resend(data: ResendRequest): Promise<OtpCodeResponse> {
		const { email } = data;

		const account = await this.accountRepo.findBy({ email });

		if (!account || account.isVerified || account.deletedAt)
			throw new RpcException({
				code: GrpcStatus.INVALID_ARGUMENT,
				details:
					'Аккаунт с такой почтой либо не существует, либо он верифицирован'
			});

		const { code } = await this.otpService.generate(
			account.id,
			OtpKey.EMAIL
		);

		this.logger.log(
			`[${account.id}] [${account.role}] Перевыпуск OTP кода`
		);

		return { code };
	}

	public async verify(data: VerifyRequest): Promise<TokensResponse> {
		const { email, code } = data;

		const account = await this.accountRepo.findBy({ email });

		if (!account || account.isVerified || account.deletedAt)
			throw new RpcException({
				code: GrpcStatus.INVALID_ARGUMENT,
				details:
					'Аккаунт с такой почтой либо не существует, либо он верифицирован'
			});

		await this.otpService.verify(account.id, code, OtpKey.EMAIL);

		const patched = await this.accountRepo.update(account.id, {
			isVerified: true
		});

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(
			`[${account.id}] [${account.role}] Аккаунт верифицирован`
		);

		return this._authenticate(patched.id, patched.role as Role);
	}

	public async login(data: LoginRequest): Promise<TokensResponse> {
		const { username, password } = data;

		const account = await this.accountRepo.findBy({ username });

		if (!account || !account.isVerified || account.deletedAt)
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Неверный логин или пароль'
			});

		const isValidPassword = await this.hashService.verify(
			account.password,
			password
		);

		if (!isValidPassword)
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Неверный логин или пароль'
			});

		this.logger.log(`[${account.id}] [${account.role}] Вход в систему`);

		return this._authenticate(account.id, account.role as Role);
	}

	public async refresh(data: RefreshRequest): Promise<TokensResponse> {
		const { refreshToken } = data;

		const { id } = this.tokenService.verify(refreshToken);

		const storedToken = await this.session.get(id);
		if (!storedToken || refreshToken !== storedToken)
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Время сессии истекло'
			});

		const account = await this.accountRepo.findBy({ id });

		if (!account || account.deletedAt)
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Недействительный токен'
			});

		this.logger.log(`[${account.id}] [${account.role}] Обновление сессии`);

		return this._authenticate(account.id, account.role as Role);
	}

	public async logout(data: RefreshRequest): Promise<StringMessage> {
		const { refreshToken } = data;
		try {
			const { id, role } = this.tokenService.verify(refreshToken);
			await this.session.delete(id);
			this.logger.log(`[${id}] [${role}] Выход из системы`);
		} catch {
			// ignore
		}
		return { message: 'Выход из системы' };
	}

	private async _authenticate(
		id: string,
		role: Role
	): Promise<TokensResponse> {
		const { accessToken, refreshToken, refreshTtl } =
			this.tokenService.signTokens({ id, role });

		await this.session.set(id, refreshToken);

		return { accessToken, refreshToken, refreshTtl };
	}
}
