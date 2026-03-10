import {
	Inject,
	Injectable,
	Logger,
	UnauthorizedException
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
	AccountRepository,
	CACHE_EVENTS,
	HASH_SERVICE,
	HashService,
	OTP_SERVICE,
	OtpService
} from 'src/core';
import { OtpKey } from 'src/shared';

import { OtpCodeResponse } from '../auth/dto';

import { ChangePasswordRequest, ConfirmPasswordRequest } from './dto';

@Injectable()
export class AccountService {
	private readonly logger = new Logger(AccountService.name);

	public constructor(
		private readonly accountRepo: AccountRepository,
		private readonly eventEmmiter: EventEmitter2,

		@Inject(HASH_SERVICE) private readonly hashService: HashService,
		@Inject(OTP_SERVICE) private readonly otpService: OtpService
	) {}

	public async changePassword(
		id: string,
		dto: ChangePasswordRequest
	): Promise<OtpCodeResponse> {
		const { oldPassword } = dto;

		const user = await this.accountRepo.findBy({ id });

		if (!user || user.deletedAt)
			throw new UnauthorizedException('Аккаунт не существует');

		const isVerified = await this.hashService.verify(
			user.password,
			oldPassword
		);

		if (!isVerified) throw new UnauthorizedException('Неверный пароль');

		this.logger.log(
			`[${user.id}] [${user.role}] Иницализация смены пароля`
		);

		return this.otpService.generate(id, OtpKey.PASSWORD);
	}

	public async confirmPassword(id: string, dto: ConfirmPasswordRequest) {
		const { code, newPassword } = dto;

		const user = await this.accountRepo.findBy({ id });

		if (!user || user.deletedAt)
			throw new UnauthorizedException('Аккаунт не существует');

		await this.otpService.verify(user.id, code, OtpKey.PASSWORD);

		const hash = await this.hashService.hash(newPassword);

		await this.accountRepo.update(user.id, { password: hash });

		this.logger.log(
			`[${user.id}] [${user.role}] Подтверждение смены пароля, пароль изменен`
		);

		return { message: 'Пароль изменен' };
	}

	public async delete(id: string) {
		const user = await this.accountRepo.findBy({ id });

		if (!user || user.deletedAt)
			throw new UnauthorizedException('Аккаунт не существует');

		await this.accountRepo.update(id, { deletedAt: new Date() });

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(`[${user.id}] [${user.role}] Аккаунт удален`);

		return { message: 'Аккаунт удален' };
	}
}
