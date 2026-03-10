import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CACHE_EVENTS, ProfileRepository, UserRepository } from 'src/core';

import {
	CreateProfileRequest,
	ProfileResponse,
	UpdateProfileRequest
} from './dto';

@Injectable()
export class ProfileService {
	private readonly logger = new Logger(ProfileService.name);

	public constructor(
		private readonly profileRepo: ProfileRepository,
		private readonly userRepo: UserRepository,
		private readonly eventEmmiter: EventEmitter2
	) {}

	public async create(
		accountId: string,
		dto: CreateProfileRequest
	): Promise<ProfileResponse> {
		const user = await this.userRepo.findBy({ id: accountId });

		if (!user || user.profile || user.deletedAt)
			throw new ConflictException('Нельзя создать профиль');

		const profile = await this.profileRepo.create(accountId, dto);

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
		const user = await this.userRepo.findBy({ id: accountId });

		if (!user || !user.profile || user.deletedAt)
			throw new NotFoundException('Нельзя изменить профиль');

		const pathedProfile = await this.profileRepo.update(accountId, dto);

		this.eventEmmiter.emit(CACHE_EVENTS.USERS_INVALIDATE);

		this.logger.log(
			`[${user.id}] [${user.role}] Профиль обновлен - ${pathedProfile.id}`
		);

		return pathedProfile;
	}
}
