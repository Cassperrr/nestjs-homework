import {
	ConflictException,
	Inject,
	Injectable,
	Logger,
	NotFoundException
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
	CACHE_EVENTS,
	CACHE_SERVICE,
	CacheService,
	UserRepository
} from 'src/core';

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

@Injectable()
export class ProfileService {
	private readonly logger = new Logger(ProfileService.name);

	public constructor(
		private readonly userRepo: UserRepository,
		private readonly eventEmmiter: EventEmitter2,

		@Inject(CACHE_SERVICE) private readonly cacheService: CacheService
	) {}

	public async create(
		accountId: string,
		dto: CreateProfileRequest
	): Promise<ProfileResponse> {
		const user = await this.userRepo.findUser({ id: accountId });

		if (!user || user.profile || user.deletedAt)
			throw new ConflictException('Нельзя создать профиль');

		const profile = await this.userRepo.createProfile(accountId, dto);

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(
			`[${user.id}] [${user.role}] Профиль создан - ${profile.id}`
		);

		return profile;
	}

	public async update(
		accountId: string,
		dto: UpdateProfileRequest
	): Promise<ProfileResponse> {
		const user = await this.userRepo.findUser({ id: accountId });

		if (!user || !user.profile || user.deletedAt)
			throw new NotFoundException('Нельзя изменить профиль');

		const pathedProfile = await this.userRepo.updateProfile(accountId, dto);

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(
			`[${user.id}] [${user.role}] Профиль обновлен - ${pathedProfile.id}`
		);

		return pathedProfile;
	}

	public async getMe(accountId: string): Promise<UserResponse> {
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

		const { key, ttl } = this.cacheService.usersKeyOptions({
			username,
			cursor,
			limit
		});

		const cached = await this.cacheService.getBuffer<AllUsersResponse>(key);
		if (cached) {
			this.logger.log(`[${existing.id}] Cache HIT: ${key}`);
			return cached;
		}

		const users = await this.userRepo.findAllUsers(cursor, limit, username);

		await this.cacheService.setBuffers<AllUsersResponse>(key, users, ttl);

		this.logger.log(`[${existing.id}] [${existing.role}] Cache MISS`);

		return users;
	}

	public async findActiveUsers(
		accountId: string,
		query: FindActiveUsersRequest
	): Promise<ActiveUserResponse[]> {
		const existing = await this.userRepo.findUser({ id: accountId });

		if (!existing || existing.deletedAt)
			throw new NotFoundException('Нет доступа');

		const { minAge, maxAge } = query;
		return this.userRepo.findActiveUsers(minAge, maxAge) as Promise<
			ActiveUserResponse[]
		>;
	}

	// public async findUserByUsername(
	// 	accountId: string,
	// 	query: FindUserRequest
	// ): Promise<UserResponse> {
	// 	const existing = await this.userRepo.findUser({ id: accountId });

	// 	if (!existing || existing.deletedAt)
	// 		throw new NotFoundException('Нет доступа');

	// 	const { username } = query;

	// 	const user = await this.userRepo.findUser({ username });
	// 	if (!user) throw new NotFoundException('Пользователь не найден');

	// 	this.logger.log(
	// 		`[${existing.id}] [${existing.role}] Выданы данные об аккаунте - ${user.id}`
	// 	);

	// 	return user;
	// }
}
