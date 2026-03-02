import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { UserRepository } from 'src/infra';

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
	public constructor(private readonly userRepo: UserRepository) {}

	public async create(
		accountId: string,
		dto: CreateProfileRequest
	): Promise<ProfileResponse> {
		const user = await this.userRepo.findUser({ id: accountId });

		if (!user || user.profile || user.deletedAt)
			throw new ConflictException('Нельзя создать профиль');

		return this.userRepo.createProfile(accountId, dto);
	}

	public async update(
		accountId: string,
		dto: UpdateProfileRequest
	): Promise<ProfileResponse> {
		const user = await this.userRepo.findUser({ id: accountId });

		if (!user || !user.profile || user.deletedAt)
			throw new NotFoundException('Нельзя изменить профиль');

		return this.userRepo.updateProfile(accountId, dto);
	}

	public async getMe(accountId: string): Promise<UserResponse | null> {
		const user = await this.userRepo.findUser({ id: accountId });

		if (!user || user.deletedAt)
			throw new NotFoundException('Профиль не найден');

		return user;
	}

	public async findAllUsers(
		accountId: string,
		query: FindAllUserRequest
	): Promise<AllUsersResponse> {
		const existing = await this.userRepo.findUser({ id: accountId });

		if (!existing || existing.deletedAt)
			throw new NotFoundException('Нет доступа');

		const { cursor, limit = 10, username } = query;
		return this.userRepo.findAllUsers(cursor, limit, username);
	}

	public async findUserByUsername(
		accountId: string,
		query: FindUserRequest
	): Promise<UserResponse | null> {
		const existing = await this.userRepo.findUser({ id: accountId });

		if (!existing || existing.deletedAt)
			throw new NotFoundException('Нет доступа');

		const { username } = query;
		const user = await this.userRepo.findUser({ username });
		if (!user) throw new NotFoundException('Пользователь не найден');
		return user;
	}
}
