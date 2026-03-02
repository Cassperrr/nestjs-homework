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
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { Id, Protected } from 'src/common';

import { OtpCodeResponse } from '../auth/dto';

import { AccountService } from './account.service';
import { ChangePasswordRequest, ConfirmPasswordRequest } from './dto';

@Controller('account')
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@ApiOperation({
		summary: 'Иницииализация смены пароля пользователя'
	})
	@ApiBearerAuth()
	@ApiOkResponse({ type: OtpCodeResponse })
	@Protected()
	@Post('password/change')
	@HttpCode(HttpStatus.OK)
	public async changePassword(
		@Id() id: string,
		@Body() dto: ChangePasswordRequest
	) {
		return this.accountService.changePassword(id, dto);
	}

	@ApiOperation({
		summary: 'Подтверждение смены пароля пользователя'
	})
	@ApiBearerAuth()
	@Protected()
	@Patch('password/confirm')
	@HttpCode(HttpStatus.OK)
	public async confirmPassword(
		@Id() id: string,
		@Body() dto: ConfirmPasswordRequest
	) {
		return this.accountService.confirmPassword(id, dto);
	}

	@ApiOperation({
		summary: 'Удалить аккаунта пользователя'
	})
	@ApiBearerAuth()
	@Protected()
	@Delete('delete')
	@HttpCode(HttpStatus.OK)
	public async delete(
		@Res({ passthrough: true }) res: Response,
		@Id() id: string
	) {
		return this.accountService.delete(res, id);
	}
}
