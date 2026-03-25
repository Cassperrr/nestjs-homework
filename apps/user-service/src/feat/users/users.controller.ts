import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
	type FindActiveUsersRequest,
	type FindActiveUsersResponse,
	type FindAllUsersRequest,
	type FindAllUsersResponse,
	type FindMeRequest,
	type UserResponse,
	USERS_SERVICE_NAME
} from 'contracts/gen/users';

import { UsersService } from './users.service';

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@GrpcMethod(USERS_SERVICE_NAME)
	public async findMe(data: FindMeRequest): Promise<UserResponse> {
		return this.usersService.findMe(data);
	}

	@GrpcMethod(USERS_SERVICE_NAME)
	public async findAll(
		data: FindAllUsersRequest
	): Promise<FindAllUsersResponse> {
		return this.usersService.findAll(data);
	}

	@GrpcMethod(USERS_SERVICE_NAME)
	public async findActive(
		data: FindActiveUsersRequest
	): Promise<FindActiveUsersResponse> {
		return this.usersService.findActive(data);
	}
}
