import { Module } from '@nestjs/common';

import { AccountClientGrpc } from './account-client.grpc';
import { AccountController } from './account.controller';

@Module({
	controllers: [AccountController],
	providers: [AccountClientGrpc],
	exports: [AccountClientGrpc]
})
export class AccountModule {}
