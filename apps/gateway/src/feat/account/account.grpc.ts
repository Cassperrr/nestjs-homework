import { AbstractGrpcClient, InjectGrpcClient } from '@libs/grpc';
import { Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	ACCOUNT_PACKAGE_NAME,
	ACCOUNT_SERVICE_NAME,
	AccountServiceClient
} from 'contracts/gen/account';

@Injectable()
export class AccountClientGrpc extends AbstractGrpcClient<AccountServiceClient> {
	public constructor(
		@InjectGrpcClient(ACCOUNT_PACKAGE_NAME) client: ClientGrpc
	) {
		super(client, ACCOUNT_SERVICE_NAME);
	}
}
