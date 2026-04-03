import { GatewayEnv } from '@gateway/src/config';
import { AbstractGrpcClient, InjectGrpcClient } from '@libs/grpc';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	TRANSACTION_PACKAGE_NAME,
	TRANSACTION_SERVICE_NAME,
	TransactionServiceClient
} from 'contracts/gen/transaction';

@Injectable()
export class TransactionClientGrpc extends AbstractGrpcClient<TransactionServiceClient> {
	public constructor(
		@InjectGrpcClient(TRANSACTION_PACKAGE_NAME) client: ClientGrpc,
		private readonly config: ConfigService<GatewayEnv, true>
	) {
		const token = config.get('GATEWAY_ACCESS_TOKEN', { infer: true });
		super(client, TRANSACTION_SERVICE_NAME, token);
	}
}
