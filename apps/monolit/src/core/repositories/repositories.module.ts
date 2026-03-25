import { Module } from '@nestjs/common';

import { AccountRepository } from './account.repository';
import { AvatarRepository } from './avatar.repository';
import { BalanceRepository } from './balance.repository';
import { ProfileRepository } from './profile.repository';
import { UsersRepository } from './user.repository';

@Module({
	providers: [
		AccountRepository,
		ProfileRepository,
		AvatarRepository,
		UsersRepository,
		BalanceRepository
	],
	exports: [
		AccountRepository,
		ProfileRepository,
		AvatarRepository,
		UsersRepository,
		BalanceRepository
	]
})
export class RepositoriesModule {}
