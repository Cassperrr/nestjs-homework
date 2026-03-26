import { createGrpcController } from '@libs/grpc';
import { ACCOUNT_SERVICE_NAME } from 'contracts/gen/account';

import { AccountService } from './account.service';

export const AccountController = createGrpcController(
	ACCOUNT_SERVICE_NAME,
	AccountService
);

// @Controller()
// export class AccountController {
// 	constructor(private readonly accountService: AccountService) {}

// 	@GrpcMethod(ACCOUNT_SERVICE_NAME)
// 	public async changePassword(
// 		data: ChangePasswordRequest
// 	): Promise<OtpCodeResponse> {
// 		return this.accountService.changePassword(data);
// 	}

// 	@GrpcMethod(ACCOUNT_SERVICE_NAME)
// 	public async confirmPassword(
// 		data: ConfirmPasswordRequest
// 	): Promise<StringMessage> {
// 		return this.accountService.confirmPassword(data);
// 	}

// 	@GrpcMethod(ACCOUNT_SERVICE_NAME)
// 	public async delete(data: DeleteRequest): Promise<StringMessage> {
// 		return this.accountService.delete(data);
// 	}
// }
