import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { HASH_SERVICE, HashService, OTP_SERVICE, OtpService } from 'src/core';
import { OtpKey } from 'src/shared';

import { AccountRepository } from './account.repository';
import { ChangePasswordRequest, ConfirmPasswordRequest } from './dto';

@Injectable()
export class AccountService {
	public constructor(
		@Inject(HASH_SERVICE) private readonly hashService: HashService,
		@Inject(OTP_SERVICE) private readonly otpService: OtpService,

		private readonly accountRepo: AccountRepository
	) {}

	public async changePassword(id: string, dto: ChangePasswordRequest) {
		const { oldPassword } = dto;

		const account = await this.accountRepo.findById(id);

		if (!account)
			throw new UnauthorizedException(
				'Аккаунт либо не существует, либо удален'
			);

		const isVerified = await this.hashService.verify(
			account.password,
			oldPassword
		);

		if (!isVerified) throw new UnauthorizedException('Неверный пароль');

		return this.otpService.generate(id, OtpKey.PASSWORD);
	}

	public async confirmPassword(id: string, dto: ConfirmPasswordRequest) {
		const { code, newPassword } = dto;

		const account = await this.accountRepo.findById(id);

		if (!account)
			throw new UnauthorizedException(
				'Аккаунт либо не существует, либо удален'
			);

		await this.otpService.verify(account.id, code, OtpKey.PASSWORD);

		const hash = await this.hashService.hash(newPassword);

		await this.accountRepo.update(account.id, { password: hash });

		return { message: 'Пароль изменен' };
	}
}
