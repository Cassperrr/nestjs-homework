import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { Role } from 'prisma/generated/enums';
import { AccountId, Protected } from 'src/common';

import { ApiGetActive, ApiGetAll, ApiGetMe } from './api';
import { FindActiveUsersRequest, FindAllUserRequest } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiGetMe()
	@Protected()
	@Get('me')
	@HttpCode(HttpStatus.OK)
	public findMe(@AccountId() id: string) {
		return this.userService.findMe(id);
	}

	@ApiGetAll()
	@Protected(Role.ADMIN)
	@Get('all')
	@HttpCode(HttpStatus.OK)
	public findAll(
		@AccountId() id: string,
		@Query() query: FindAllUserRequest
	) {
		return this.userService.findAll(id, query);
	}

	@ApiGetActive()
	@Protected(Role.ADMIN)
	@Get('active')
	@HttpCode(HttpStatus.OK)
	public findActive(
		@AccountId() id: string,
		@Query() query: FindActiveUsersRequest
	) {
		return this.userService.findActive(id, query);
	}
}
