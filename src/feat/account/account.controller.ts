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
import { AccountId, Protected } from 'src/common';

import { AccountService } from './account.service';
import { ApiDeleteAccount, ApiPasswordChange, ApiPasswordConfirm } from './api';
import { ChangePasswordRequest, ConfirmPasswordRequest } from './dto';

@Controller('account')
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@ApiPasswordChange()
	@Protected()
	@Post('password/change')
	@HttpCode(HttpStatus.OK)
	public async changePassword(
		@AccountId() id: string,
		@Body() dto: ChangePasswordRequest
	) {
		return this.accountService.changePassword(id, dto);
	}

	@ApiPasswordConfirm()
	@Protected()
	@Patch('password/confirm')
	@HttpCode(HttpStatus.OK)
	public async confirmPassword(
		@AccountId() id: string,
		@Body() dto: ConfirmPasswordRequest
	) {
		return this.accountService.confirmPassword(id, dto);
	}

	@ApiDeleteAccount()
	@Protected()
	@Delete('delete')
	@HttpCode(HttpStatus.OK)
	public async delete(
		@Res({ passthrough: true }) res: Response,
		@AccountId() id: string
	) {
		const msg = await this.accountService.delete(id);
		res.clearCookie('refreshToken');
		return msg;
	}
}
