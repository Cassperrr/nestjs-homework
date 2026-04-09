import type { GatewayEnv } from '@gateway/src/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	PROFILE_SERVICE_NAME,
	type ProfileServiceClient
} from 'contracts/grpc/gen/profile';
import { AbstractGrpcClient, InjectGrpcClient } from 'libsV2/grpc';

@Injectable()
export class ProfileClientGrpc extends AbstractGrpcClient<ProfileServiceClient> {
	public constructor(
		@InjectGrpcClient('PROFILE') client: ClientGrpc,
		private readonly config: ConfigService<GatewayEnv, true>
	) {
		const token = config.get('GATEWAY_ACCESS_TOKEN', { infer: true });
		super(client, PROFILE_SERVICE_NAME, token);
	}
}
