import { AccountId, Protected } from '@gateway/src/common';
import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	Res
} from '@nestjs/common';
import type { Response } from 'express';
import { Role } from 'shared';

import { OtpCodeResponse } from '../auth/dto';

import { AccountClientGrpc } from './account-client.grpc';
import { ApiDeleteAccount, ApiPasswordChange, ApiPasswordConfirm } from './api';
import { ChangePasswordRequest, ConfirmPasswordRequest } from './dto';

@Controller('account')
export class AccountController {
	constructor(private readonly client: AccountClientGrpc) {}

	@ApiPasswordChange()
	@Protected()
	@Post('password/change')
	@HttpCode(HttpStatus.OK)
	public async changePassword(
		@AccountId() accountId: string,
		@Body() dto: ChangePasswordRequest
	): Promise<OtpCodeResponse> {
		return this.client.call('changePassword', { accountId, ...dto });
	}

	@ApiPasswordConfirm()
	@Protected()
	@Patch('password/confirm')
	@HttpCode(HttpStatus.OK)
	public async confirmPassword(
		@AccountId() accountId: string,
		@Body() dto: ConfirmPasswordRequest
	) {
		return this.client.call('confirmPassword', { accountId, ...dto });
	}

	@ApiDeleteAccount()
	@Protected()
	@Delete('delete')
	@HttpCode(HttpStatus.OK)
	public async delete(
		@Res({ passthrough: true }) res: Response,
		@AccountId() accountId: string
	) {
		res.clearCookie('refreshToken');
		return this.client.call('delete', { accountId });
	}
}
