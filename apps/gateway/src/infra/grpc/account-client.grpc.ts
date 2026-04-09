import type { GatewayEnv } from '@gateway/src/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	ACCOUNT_SERVICE_NAME,
	type AccountServiceClient
} from 'contracts/grpc/gen/account';
import { AbstractGrpcClient, InjectGrpcClient } from 'libsV2/grpc';

@Injectable()
export class AccountClientGrpc extends AbstractGrpcClient<AccountServiceClient> {
	public constructor(
		@InjectGrpcClient('ACCOUNT') client: ClientGrpc,
		private readonly config: ConfigService<GatewayEnv, true>
	) {
		const token = config.get('GATEWAY_ACCESS_TOKEN', { infer: true });
		super(client, ACCOUNT_SERVICE_NAME, token);
	}
}
