import { Module } from '@nestjs/common';

import { AccountRepository } from './account.repository';
import { ProfileRepository } from './profile.repository';

@Module({
	providers: [AccountRepository, ProfileRepository],
	exports: [AccountRepository, ProfileRepository]
})
export class RepositoriesModule {}
