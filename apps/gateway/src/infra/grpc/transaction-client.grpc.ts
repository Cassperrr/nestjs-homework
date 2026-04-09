import type { GatewayEnv } from '@gateway/src/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	TRANSACTION_SERVICE_NAME,
	type TransactionServiceClient
} from 'contracts/grpc/gen/transaction';
import { AbstractGrpcClient, InjectGrpcClient } from 'libsV2/grpc';

@Injectable()
export class TransactionClientGrpc extends AbstractGrpcClient<TransactionServiceClient> {
	public constructor(
		@InjectGrpcClient('TRANSACTION') client: ClientGrpc,
		private readonly config: ConfigService<GatewayEnv, true>
	) {
		const token = config.get('GATEWAY_ACCESS_TOKEN', { infer: true });
		super(client, TRANSACTION_SERVICE_NAME, token);
	}
}
