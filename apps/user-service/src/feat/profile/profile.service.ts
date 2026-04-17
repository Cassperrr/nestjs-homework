import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RpcException } from '@nestjs/microservices';
import {
	CACHE_EVENTS,
	ProfileRepository,
	UsersRepository
} from '@user-service/src/core';
import type {
	CreateProfileRequest,
	ProfileResponse,
	UpdateProfileRequest
} from 'contracts/grpc/gen/profile';
import { GrpcStatus } from 'libs/grpc';

@Injectable()
export class ProfileService {
	private readonly logger = new Logger(ProfileService.name);

	public constructor(
		private readonly profileRepo: ProfileRepository,
		private readonly userRepo: UsersRepository,
		private readonly eventEmmiter: EventEmitter2
	) {}

	private async _findAndCheckUser(accountId: string) {
		const user = await this.userRepo.findBy({ id: accountId });

		if (!user || user.deletedAt)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Пользователя не существует'
			});

		return user;
	}

	public async createProfile(
		data: CreateProfileRequest
	): Promise<ProfileResponse> {
		const { accountId, age, firstName, lastName, description } = data;

		const user = await this._findAndCheckUser(accountId);

		if (user.profile)
			throw new RpcException({
				code: GrpcStatus.ALREADY_EXISTS,
				details: 'Профиль уже существует'
			});

		const profile = await this.profileRepo.create(accountId, {
			age,
			firstName,
			lastName,
			description
		});

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(
			`[${user.id}] [${user.role}] Профиль создан - ${profile.id}`
		);

		return { avatars: [], ...profile };
	}

	public async updateProfile(
		data: UpdateProfileRequest
	): Promise<ProfileResponse> {
		const { accountId, age, firstName, lastName, description } = data;

		const user = await this._findAndCheckUser(accountId);

		if (!user.profile)
			throw new RpcException({
				code: GrpcStatus.NOT_FOUND,
				details: 'Сначала создайте профиль'
			});

		const profile = await this.profileRepo.update(accountId, {
			age,
			firstName,
			lastName,
			description
		});

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(
			`[${user.id}] [${user.role}] Профиль обновлен - ${profile.id}`
		);

		return { avatars: [], ...profile };
	}
}
