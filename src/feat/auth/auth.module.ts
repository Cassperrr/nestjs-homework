import { Module } from '@nestjs/common';

import { AccountRepository } from '../account/account.repository';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	controllers: [AuthController],
	providers: [AuthService, AccountRepository]
})
export class AuthModule {}
