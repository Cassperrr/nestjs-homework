import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { ProfileRepository } from 'src/infra';

import {
	CreateProfileRequest,
	ProfileResponse,
	UpdateProfileRequest
} from './dto';

@Injectable()
export class ProfileService {
	public constructor(private readonly profileRepo: ProfileRepository) {}

	public async create(
		accountId: string,
		dto: CreateProfileRequest
	): Promise<ProfileResponse> {
		const existing = await this.profileRepo.findByAccountId(accountId);

		if (existing) throw new ConflictException('Профиль уже существует');

		return this.profileRepo.create(accountId, dto);
	}

	public async update(
		accountId: string,
		dto: UpdateProfileRequest
	): Promise<ProfileResponse> {
		const existing = await this.profileRepo.findByAccountId(accountId);

		if (!existing) throw new NotFoundException('Профиля не существует');

		return this.profileRepo.update(accountId, dto);
	}

	public async me(accountId: string) {
		return this.profileRepo.findMeByAccountId(accountId);
	}
}
