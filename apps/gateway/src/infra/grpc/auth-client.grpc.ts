import type { GatewayEnv } from '@gateway/src/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	AUTH_SERVICE_NAME,
	type AuthServiceClient
} from 'contracts/grpc/gen/auth';
import { AbstractGrpcClient, InjectGrpcClient } from 'libsV2/grpc';

@Injectable()
export class AuthClientGrpc extends AbstractGrpcClient<AuthServiceClient> {
	public constructor(
		@InjectGrpcClient('AUTH') client: ClientGrpc,
		private readonly config: ConfigService<GatewayEnv, true>
	) {
		const token = config.get('GATEWAY_ACCESS_TOKEN', { infer: true });
		super(client, AUTH_SERVICE_NAME, token);
	}
}
