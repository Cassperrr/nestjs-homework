import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Put,
	Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Role } from 'prisma/generated/enums';
import { AccountId, Protected } from 'src/common';

import {
	ActiveUserResponse,
	AllUsersResponse,
	CreateProfileRequest,
	FindActiveUsersRequest,
	FindAllUserRequest,
	ProfileResponse,
	UpdateProfileRequest,
	UserResponse
} from './dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@ApiOperation({
		summary: 'Создать профиль пользователя'
	})
	@ApiOkResponse({ type: ProfileResponse })
	@ApiBearerAuth()
	@Protected()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	public create(@AccountId() id: string, @Body() dto: CreateProfileRequest) {
		return this.profileService.create(id, dto);
	}

	@ApiOperation({
		summary: 'Обновить данные профиля пользователя'
	})
	@ApiOkResponse({ type: ProfileResponse })
	@ApiBearerAuth()
	@Protected()
	@Put()
	@HttpCode(HttpStatus.OK)
	public update(@AccountId() id: string, @Body() dto: UpdateProfileRequest) {
		return this.profileService.update(id, dto);
	}

	@ApiOperation({
		summary: 'Получить полный профиль моего пользователя'
	})
	@ApiOkResponse({ type: UserResponse })
	@ApiBearerAuth()
	@Protected()
	@Get()
	@HttpCode(HttpStatus.OK)
	public getMe(@AccountId() id: string) {
		return this.profileService.getMe(id);
	}

	@ApiOperation({
		summary:
			'Получить всех пользователей или найти пользователя по username, только для администратора'
	})
	@ApiOkResponse({ type: AllUsersResponse })
	@ApiBearerAuth()
	@Protected(Role.ADMIN)
	@Get('all')
	@HttpCode(HttpStatus.OK)
	public getAll(@AccountId() id: string, @Query() query: FindAllUserRequest) {
		return this.profileService.findAllUsers(id, query);
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
	public getActive(
		@AccountId() id: string,
		@Query() query: FindActiveUsersRequest
	) {
		return this.profileService.findActiveUsers(id, query);
	}

	// @ApiOperation({
	// 	summary: 'Найти пользователя, только для админинистратора'
	// })
	// @ApiOkResponse({ type: UserResponse })
	// @ApiBearerAuth()
	// @Protected(Role.ADMIN)
	// @Get(':username')
	// @HttpCode(HttpStatus.OK)
	// public getUser(@AccountId() id: string, @Query() query: FindUserRequest) {
	// 	return this.profileService.findUserByUsername(id, query);
	// }
}
