import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
	ACCOUNT_SERVICE_NAME,
	type ChangePasswordRequest,
	type ConfirmPasswordRequest,
	type DeleteRequest
} from 'contracts/gen/account';
import type { OtpCodeResponse, StringMessage } from 'contracts/gen/shared';

import { AccountService } from './account.service';

@Controller()
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@GrpcMethod(ACCOUNT_SERVICE_NAME)
	public async changePassword(
		data: ChangePasswordRequest
	): Promise<OtpCodeResponse> {
		return this.accountService.changePassword(data);
	}

	@GrpcMethod(ACCOUNT_SERVICE_NAME)
	public async confirmPassword(
		data: ConfirmPasswordRequest
	): Promise<StringMessage> {
		return this.accountService.confirmPassword(data);
	}

	@GrpcMethod(ACCOUNT_SERVICE_NAME)
	public async delete(data: DeleteRequest): Promise<StringMessage> {
		return this.accountService.delete(data);
	}
}
