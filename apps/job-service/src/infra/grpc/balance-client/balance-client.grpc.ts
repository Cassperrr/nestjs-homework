import { AbstractGrpcClient, InjectGrpcClient } from '@libs/grpc';
import { Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	BALANCE_PACKAGE_NAME,
	BALANCE_SERVICE_NAME,
	BalanceServiceClient
} from 'contracts/gen/balance';

@Injectable()
export class BalanceClientGrpc extends AbstractGrpcClient<BalanceServiceClient> {
	public constructor(
		@InjectGrpcClient(BALANCE_PACKAGE_NAME) client: ClientGrpc
	) {
		super(client, BALANCE_SERVICE_NAME);
	}
}
