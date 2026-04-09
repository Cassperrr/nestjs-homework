import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RpcException } from '@nestjs/microservices';
import {
	AccountRepository,
	CACHE_EVENTS,
	HASH_SERVICE,
	HashService,
	OTP_SERVICE,
	OtpService
} from '@user-service/src/core';
import type {
	ChangePasswordRequest,
	ConfirmPasswordRequest,
	DeleteRequest
} from 'contracts/grpc/gen/account';
import type { OtpCodeResponse, StringMessage } from 'contracts/grpc/gen/shared';
import { GrpcStatus } from 'libsV2/grpc';
import { OtpKey } from 'shared';

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
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Аккаунт не существует'
			});

		return account;
	}

	public async changePassword(
		data: ChangePasswordRequest
	): Promise<OtpCodeResponse> {
		const { accountId, oldPassword } = data;

		const account = await this._findAndCheckAccount(accountId);

		const isVerified = await this.hashService.verify(
			account.password,
			oldPassword
		);

		if (!isVerified)
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Неверный пароль'
			});

		this.logger.log(
			`[${account.id}] [${account.role}] Иницализация смены пароля`
		);

		return this.otpService.generate(accountId, OtpKey.PASSWORD);
	}

	public async confirmPassword(
		data: ConfirmPasswordRequest
	): Promise<StringMessage> {
		const { accountId, code, newPassword } = data;

		const account = await this._findAndCheckAccount(accountId);

		await this.otpService.verify(account.id, code, OtpKey.PASSWORD);

		const hash = await this.hashService.hash(newPassword);

		await this.accountRepo.update(account.id, { password: hash });

		this.logger.log(
			`[${account.id}] [${account.role}] Подтверждение смены пароля, пароль изменен`
		);

		return { message: 'Пароль изменен' };
	}

	public async delete(data: DeleteRequest): Promise<StringMessage> {
		const { accountId } = data;

		const account = await this._findAndCheckAccount(accountId);

		await this.accountRepo.update(accountId, { deletedAt: new Date() });

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(`[${account.id}] [${account.role}] Аккаунт удален`);

		return { message: 'Аккаунт удален' };
	}
}
