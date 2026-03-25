import { Module } from '@nestjs/common';

import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [AuthModule, AccountModule, ProfileModule, UsersModule]
})
export class FeatModule {}
