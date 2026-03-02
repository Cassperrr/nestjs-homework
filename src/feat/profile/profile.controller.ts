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
import { Id, Protected } from 'src/common';

import {
	AllUsersResponse,
	CreateProfileRequest,
	FindAllUserRequest,
	FindUserRequest,
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
	public async create(@Id() id: string, @Body() dto: CreateProfileRequest) {
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
	public async update(@Id() id: string, @Body() dto: UpdateProfileRequest) {
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
	public async me(@Id() id: string) {
		return this.profileService.me(id);
	}

	@ApiOperation({
		summary: 'Получить всех пользователей, только для администратора'
	})
	@ApiOkResponse({ type: AllUsersResponse })
	@ApiBearerAuth()
	@Protected(Role.ADMIN)
	@Get('all')
	@HttpCode(HttpStatus.OK)
	public async all(@Query() query: FindAllUserRequest) {
		return this.profileService.findAllUsers(query);
	}

	@ApiOperation({
		summary: 'Найти пользователя по username, только для админинистратора'
	})
	@ApiOkResponse({ type: UserResponse })
	@ApiBearerAuth()
	@Protected(Role.ADMIN)
	@Get(':username')
	@HttpCode(HttpStatus.OK)
	public async user(@Query() query: FindUserRequest) {
		return this.profileService.findUserByUsername(query);
	}
}
