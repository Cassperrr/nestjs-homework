import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Role } from 'prisma/generated/enums';
import { AccountId, Protected } from 'src/common';

import {
	ActiveUserResponse,
	FindActiveUsersRequest,
	FindAllUserRequest,
	FindAllUsersResponse,
	UserResponse
} from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({
		summary: 'Получить полный профиль моего пользователя'
	})
	@ApiOkResponse({ type: UserResponse })
	@ApiBearerAuth()
	@Protected()
	@Get('me')
	@HttpCode(HttpStatus.OK)
	public findMe(@AccountId() id: string) {
		return this.userService.findMe(id);
	}

	@ApiOperation({
		summary:
			'Получить всех пользователей или найти пользователя по username, только для администратора'
	})
	@ApiOkResponse({ type: FindAllUsersResponse })
	@ApiBearerAuth()
	@Protected(Role.ADMIN)
	@Get('all')
	@HttpCode(HttpStatus.OK)
	public findAll(
		@AccountId() id: string,
		@Query() query: FindAllUserRequest
	) {
		return this.userService.findAll(id, query);
	}

	@ApiOperation({
		summary:
			'Получить всех активных пользователей, только для администратора'
	})
	@ApiOkResponse({ type: ActiveUserResponse, isArray: true })
	@ApiBearerAuth()
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
