import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CACHE_SERVICE, CacheService, UserRepository } from 'src/core';

import {
	ActiveUserResponse,
	FindActiveUsersRequest,
	FindAllUserRequest,
	FindAllUsersResponse,
	UserResponse
} from './dto';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	public constructor(
		private readonly userRepo: UserRepository,
		private readonly eventEmmiter: EventEmitter2,

		@Inject(CACHE_SERVICE) private readonly cacheService: CacheService
	) {}

	public async findMe(accountId: string): Promise<UserResponse> {
		const user = await this.userRepo.findBy({ id: accountId });

		if (!user || user.deletedAt)
			throw new NotFoundException('Профиль не найден');

		return user;
	}

	public async findAll(
		accountId: string,
		query: FindAllUserRequest
	): Promise<FindAllUsersResponse> {
		const existing = await this.userRepo.findBy({ id: accountId });

		if (!existing || existing.deletedAt)
			throw new NotFoundException('Нет доступа');

		const { cursor, limit = 10, username } = query;

		const { key, ttl } = this.cacheService.usersKeyOptions({
			username,
			cursor,
			limit
		});

		const cached =
			await this.cacheService.getBuffer<FindAllUsersResponse>(key);
		if (cached) {
			this.logger.log(`[${existing.id}] Cache HIT: ${key}`);
			return cached;
		}

		const users = await this.userRepo.findAll(cursor, limit, username);

		await this.cacheService.setBuffers<FindAllUsersResponse>(
			key,
			users,
			ttl
		);

		this.logger.log(`[${existing.id}] [${existing.role}] Cache MISS`);

		return users;
	}

	public async findActive(
		accountId: string,
		query: FindActiveUsersRequest
	): Promise<ActiveUserResponse[]> {
		const existing = await this.userRepo.findBy({ id: accountId });

		if (!existing || existing.deletedAt)
			throw new NotFoundException('Нет доступа');

		const { minAge, maxAge } = query;
		return this.userRepo.findActive(minAge, maxAge) as Promise<
			ActiveUserResponse[]
		>;
	}
}
