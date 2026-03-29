import { GatewayEnv } from '@gateway/src/config';
import { AbstractGrpcClient, InjectGrpcClient } from '@libs/grpc';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	PROFILE_PACKAGE_NAME,
	PROFILE_SERVICE_NAME,
	ProfileServiceClient
} from 'contracts/gen/profile';

@Injectable()
export class ProfileClientGrpc extends AbstractGrpcClient<ProfileServiceClient> {
	public constructor(
		@InjectGrpcClient(PROFILE_PACKAGE_NAME) client: ClientGrpc,
		private readonly config: ConfigService<GatewayEnv, true>
	) {
		const token = config.get('GATEWAY_ACCESS_TOKEN', { infer: true });
		super(client, PROFILE_SERVICE_NAME, token);
	}
}
