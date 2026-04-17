import { Module } from '@nestjs/common';

import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { AvatarModule } from './avatar/avatar.module';
import { BalanceModule } from './balance/balance.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		AuthModule,
		AccountModule,
		ProfileModule,
		UsersModule,
		BalanceModule,
		AvatarModule
	]
})
export class FeatModule {}
