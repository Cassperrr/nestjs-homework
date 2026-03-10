import { Module } from '@nestjs/common';

import { AccountRepository } from './account.repository';
import { AvatarRepository } from './avatar.repository';
import { ProfileRepository } from './profile.repository';
import { UserRepository } from './user.repository';

@Module({
	providers: [
		AccountRepository,
		ProfileRepository,
		AvatarRepository,
		UserRepository
	],
	exports: [
		AccountRepository,
		ProfileRepository,
		AvatarRepository,
		UserRepository
	]
})
export class RepositoriesModule {}
