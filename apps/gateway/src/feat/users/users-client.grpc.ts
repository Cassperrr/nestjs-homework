import { GatewayEnv } from '@gateway/src/config';
import { AbstractGrpcClient, InjectGrpcClient } from '@libs/grpc';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	USERS_PACKAGE_NAME,
	USERS_SERVICE_NAME,
	UsersServiceClient
} from 'contracts/gen/users';

@Injectable()
export class UsersClientGrpc extends AbstractGrpcClient<UsersServiceClient> {
	public constructor(
		@InjectGrpcClient(USERS_PACKAGE_NAME) client: ClientGrpc,
		private readonly config: ConfigService<GatewayEnv, true>
	) {
		const token = config.get('GATEWAY_ACCESS_TOKEN', { infer: true });
		super(client, USERS_SERVICE_NAME, token);
	}
}
