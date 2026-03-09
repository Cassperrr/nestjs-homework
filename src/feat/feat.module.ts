import { Module } from '@nestjs/common';

import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { AvatarModule } from './avatar/avatar.module';
import { ProfileModule } from './profile/profile.module';

@Module({
	imports: [AuthModule, AccountModule, ProfileModule, AvatarModule]
})
export class FeatModule {}
