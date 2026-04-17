import type { GatewayEnv } from '@gateway/src/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	USERS_SERVICE_NAME,
	type UsersServiceClient
} from 'contracts/grpc/gen/users';
import { AbstractGrpcClient, InjectGrpcClient } from 'libs/grpc';

@Injectable()
export class UsersClientGrpc extends AbstractGrpcClient<UsersServiceClient> {
	public constructor(
		@InjectGrpcClient('USERS') client: ClientGrpc,
		private readonly config: ConfigService<GatewayEnv, true>
	) {
		const token = config.get('GATEWAY_ACCESS_TOKEN', { infer: true });
		super(client, USERS_SERVICE_NAME, token);
	}
}
