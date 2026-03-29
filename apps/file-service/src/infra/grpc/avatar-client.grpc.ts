import type { FileServiceEnv } from '@file-service/src/config';
import { AbstractGrpcClient, InjectGrpcClient } from '@libs/grpc';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	AVATAR_PACKAGE_NAME,
	AVATAR_SERVICE_NAME,
	AvatarServiceClient
} from 'contracts/gen/avatar';

@Injectable()
export class AvatarClientGrpc extends AbstractGrpcClient<AvatarServiceClient> {
	public constructor(
		@InjectGrpcClient(AVATAR_PACKAGE_NAME) client: ClientGrpc,
		private readonly config: ConfigService<FileServiceEnv, true>
	) {
		const token = config.get('FILE_ACCESS_TOKEN', { infer: true });
		super(client, AVATAR_SERVICE_NAME, token);
	}
}
