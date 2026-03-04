import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import {
	HASH_SERVICE,
	HashService,
	OTP_SERVICE,
	OtpService,
	UserRepository
} from 'src/core';
import { OtpKey } from 'src/shared';

import { OtpCodeResponse } from '../auth/dto';

import { ChangePasswordRequest, ConfirmPasswordRequest } from './dto';

@Injectable()
export class AccountService {
	public constructor(
		@Inject(HASH_SERVICE) private readonly hashService: HashService,
		@Inject(OTP_SERVICE) private readonly otpService: OtpService,

		private readonly userRepo: UserRepository
	) {}

	public async changePassword(
		id: string,
		dto: ChangePasswordRequest
	): Promise<OtpCodeResponse> {
		const { oldPassword } = dto;

		const user = await this.userRepo.findAccount({ id });

		if (!user || user.deletedAt)
			throw new UnauthorizedException('Аккаунт не существует');

		const isVerified = await this.hashService.verify(
			user.password,
			oldPassword
		);

		if (!isVerified) throw new UnauthorizedException('Неверный пароль');

		return this.otpService.generate(id, OtpKey.PASSWORD);
	}

	public async confirmPassword(id: string, dto: ConfirmPasswordRequest) {
		const { code, newPassword } = dto;

		const user = await this.userRepo.findAccount({ id });

		if (!user || user.deletedAt)
			throw new UnauthorizedException('Аккаунт не существует');

		await this.otpService.verify(user.id, code, OtpKey.PASSWORD);

		const hash = await this.hashService.hash(newPassword);

		await this.userRepo.updateAccount(user.id, { password: hash });

		return { message: 'Пароль изменен' };
	}

	public async delete(id: string) {
		const user = await this.userRepo.findAccount({ id });

		if (!user || user.deletedAt)
			throw new UnauthorizedException('Аккаунт не существует');

		await this.userRepo.updateAccount(id, { deletedAt: new Date() });

		return { message: 'Аккаунт удален' };
	}
}
