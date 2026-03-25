import { GrpcStatus } from '@libs/grpc';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
	CACHE_SERVICE,
	CacheService,
	UsersRepository
} from '@user-service/src/core';
import type {
	FindActiveUsersRequest,
	FindActiveUsersResponse,
	FindAllUsersRequest,
	FindAllUsersResponse,
	FindMeRequest,
	UserResponse
} from 'contracts/gen/users';

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name);

	public constructor(
		private readonly userRepo: UsersRepository,

		@Inject(CACHE_SERVICE) private readonly cacheService: CacheService
	) {}

	public async findMe(data: FindMeRequest): Promise<UserResponse> {
		const { accountId } = data;

		const user = await this.userRepo.findBy({ id: accountId });

		if (!user || user.deletedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Профиль не найден'
			});

		return {
			...user,
			createdAt: user.createdAt.toISOString(),
			profile: user.profile ?? undefined
		};
	}

	public async findAll(
		data: FindAllUsersRequest
	): Promise<FindAllUsersResponse> {
		const { accountId, cursor, limit = 10, username } = data;

		const user = await this.userRepo.findBy({ id: accountId });

		if (!user || user.deletedAt)
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Нет доступа'
			});

		const { key, ttl } = this.cacheService.usersKeyOptions({
			username,
			cursor,
			limit
		});

		const cached =
			await this.cacheService.getBuffer<FindAllUsersResponse>(key);
		if (cached) {
			this.logger.log(`[${user.id}] [${user.role}] Cache HIT: ${key}`);
			return cached;
		}

		const users = await this.userRepo.findAll(cursor, limit, username);

		const mapped: FindAllUsersResponse = {
			...users,
			data: users.data.map(user => ({
				...user,
				createdAt: user.createdAt.toISOString(),
				profile: user.profile ?? undefined
			})),
			nextCursor: users.nextCursor ?? undefined
		};

		await this.cacheService.setBuffers<FindAllUsersResponse>(
			key,
			mapped,
			ttl
		);

		this.logger.log(`[${user.id}] [${user.role}] Cache MISS ${key}`);

		return mapped;
	}

	public async findActive(
		data: FindActiveUsersRequest
	): Promise<FindActiveUsersResponse> {
		const { accountId, minAge, maxAge } = data;

		const user = await this.userRepo.findBy({ id: accountId });

		if (!user || user.deletedAt)
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				details: 'Нет доступа'
			});

		const users = await this.userRepo.findActive(minAge, maxAge);
		return { users } as FindActiveUsersResponse;
	}
}
