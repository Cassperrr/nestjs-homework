import { Module } from '@nestjs/common';

import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { AvatarModule } from './avatar/avatar.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		AuthModule,
		AccountModule,
		ProfileModule,
		AvatarModule,
		UserModule
	]
})
export class FeatModule {}
