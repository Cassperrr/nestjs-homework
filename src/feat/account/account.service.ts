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

	private async _findAndCheckAccount(id: string) {
		const account = await this.accountRepo.findBy({ id });

		if (!account || account.deletedAt)
			throw new UnauthorizedException('Аккаунт не существует');

		return account;
	}

	public async changePassword(
		id: string,
		dto: ChangePasswordRequest
	): Promise<OtpCodeResponse> {
		const account = await this._findAndCheckAccount(id);

		const { oldPassword } = dto;

		const isVerified = await this.hashService.verify(
			account.password,
			oldPassword
		);

		if (!isVerified) throw new UnauthorizedException('Неверный пароль');

		this.logger.log(
			`[${account.id}] [${account.role}] Иницализация смены пароля`
		);

		return this.otpService.generate(id, OtpKey.PASSWORD);
	}

	public async confirmPassword(id: string, dto: ConfirmPasswordRequest) {
		const account = await this._findAndCheckAccount(id);

		const { code, newPassword } = dto;

		await this.otpService.verify(account.id, code, OtpKey.PASSWORD);

		const hash = await this.hashService.hash(newPassword);

		await this.accountRepo.update(account.id, { password: hash });

		this.logger.log(
			`[${account.id}] [${account.role}] Подтверждение смены пароля, пароль изменен`
		);

		return { message: 'Пароль изменен' };
	}

	public async delete(id: string) {
		const account = await this._findAndCheckAccount(id);

		await this.accountRepo.update(id, { deletedAt: new Date() });

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(`[${account.id}] [${account.role}] Аккаунт удален`);

		return { message: 'Аккаунт удален' };
	}
}
