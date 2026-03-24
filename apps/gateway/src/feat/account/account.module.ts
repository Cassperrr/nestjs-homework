import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountClientGrpc } from './account.grpc';

@Module({
	controllers: [AccountController],
	providers: [AccountClientGrpc],
	exports: [AccountClientGrpc]
})
export class AccountModule {}
