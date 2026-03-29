import { AccountId, Protected } from '@gateway/src/common';
import { UsersClientGrpc } from '@gateway/src/infra/grpc';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { Role } from 'shared';

import { ApiGetActive, ApiGetAll, ApiGetMe } from './api';
import {
	FindActiveUsersRequest,
	FindActiveUsersResponse,
	FindAllUserRequest,
	FindAllUsersResponse,
	UserResponse
} from './dto';

@Controller('users')
export class UsersController {
	public constructor(private readonly client: UsersClientGrpc) {}

	@ApiGetMe()
	@Protected()
	@Get('me')
	@HttpCode(HttpStatus.OK)
	public findMe(@AccountId() accountId: string): Promise<UserResponse> {
		return this.client.call('findMe', { accountId });
	}

	@ApiGetAll()
	@Protected()
	@Get('all')
	@HttpCode(HttpStatus.OK)
	public findAll(
		@AccountId() accountId: string,
		@Query() query: FindAllUserRequest
	): Promise<FindAllUsersResponse> {
		return this.client.call('findAll', { accountId, ...query });
	}

	@ApiGetActive()
	@Protected()
	@Get('active')
	@HttpCode(HttpStatus.OK)
	public findActive(
		@AccountId() accountId: string,
		@Query() query: FindActiveUsersRequest
	): Promise<FindActiveUsersResponse> {
		return this.client.call('findActive', { accountId, ...query });
	}
}
