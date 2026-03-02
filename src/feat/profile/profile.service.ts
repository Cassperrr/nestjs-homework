import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { ProfileRepository } from 'src/infra';

import {
	AllUsersResponse,
	CreateProfileRequest,
	FindAllUserRequest,
	FindUserRequest,
	ProfileResponse,
	UpdateProfileRequest,
	UserResponse
} from './dto';

@Injectable()
export class ProfileService {
	public constructor(private readonly profileRepo: ProfileRepository) {}

	public async create(
		accountId: string,
		dto: CreateProfileRequest
	): Promise<ProfileResponse> {
		const existing =
			await this.profileRepo.findProfileByAccountId(accountId);

		if (existing) throw new ConflictException('Профиль уже существует');

		return this.profileRepo.create(accountId, dto);
	}

	public async update(
		accountId: string,
		dto: UpdateProfileRequest
	): Promise<ProfileResponse> {
		const existing =
			await this.profileRepo.findProfileByAccountId(accountId);

		if (!existing) throw new NotFoundException('Профиля не существует');

		return this.profileRepo.update(accountId, dto);
	}

	public async me(accountId: string): Promise<UserResponse | null> {
		return this.profileRepo.findUserByAccountId(accountId);
	}

	public async findAllUsers(
		query: FindAllUserRequest
	): Promise<AllUsersResponse> {
		const { cursor, limit = 10, username } = query;
		return this.profileRepo.findAllUsers(cursor, limit, username);
	}

	public async findUserByUsername(
		query: FindUserRequest
	): Promise<UserResponse | null> {
		const { username } = query;
		const user = await this.profileRepo.findUserByUsername(username);
		if (!user) throw new NotFoundException('Пользователь не найден');
		return user;
	}
}
