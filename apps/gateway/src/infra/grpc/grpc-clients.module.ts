import { Module } from '@nestjs/common';
import { GrpcClientFactoryModule } from 'libs/grpc';

import { AccountClientGrpc } from './account-client.grpc';
import { AuthClientGrpc } from './auth-client.grpc';
import { BalanceClientGrpc } from './balance-client.grpc';
import { ProfileClientGrpc } from './profile-client.grpc';
import { TransactionClientGrpc } from './transaction-client.grpc';
import { UsersClientGrpc } from './users-client.grpc';

@Module({
	imports: [
		GrpcClientFactoryModule.registerAsync([
			'AUTH',
			'ACCOUNT',
			'PROFILE',
			'USERS',
			'BALANCE',
			'TRANSACTION'
		])
	],
	providers: [
		AuthClientGrpc,
		AccountClientGrpc,
		ProfileClientGrpc,
		UsersClientGrpc,
		BalanceClientGrpc,
		TransactionClientGrpc
	],
	exports: [
		AuthClientGrpc,
		AccountClientGrpc,
		ProfileClientGrpc,
		UsersClientGrpc,
		BalanceClientGrpc,
		TransactionClientGrpc
	]
})
export class GrpcClientsModule {}
