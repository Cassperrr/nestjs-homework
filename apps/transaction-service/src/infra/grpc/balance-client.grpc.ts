import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import type { TxServiceEnv } from '@transaction-service/src/config';
import {
	BALANCE_SERVICE_NAME,
	type BalanceServiceClient
} from 'contracts/grpc/gen/balance';
import { AbstractGrpcClient, InjectGrpcClient } from 'libsV2/grpc';

@Injectable()
export class BalanceClientGrpc extends AbstractGrpcClient<BalanceServiceClient> {
	public constructor(
		@InjectGrpcClient('BALANCE') client: ClientGrpc,
		private readonly config: ConfigService<TxServiceEnv, true>
	) {
		const token = config.get('TX_ACCESS_TOKEN', { infer: true });
		super(client, BALANCE_SERVICE_NAME, token);
	}
}
