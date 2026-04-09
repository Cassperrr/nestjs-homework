import type { FileServiceEnv } from '@file-service/src/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	AVATAR_SERVICE_NAME,
	type AvatarServiceClient
} from 'contracts/grpc/gen/avatar';
import { AbstractGrpcClient, InjectGrpcClient } from 'libsV2/grpc';

@Injectable()
export class AvatarClientGrpc extends AbstractGrpcClient<AvatarServiceClient> {
	public constructor(
		@InjectGrpcClient('AVATAR') client: ClientGrpc,
		private readonly config: ConfigService<FileServiceEnv, true>
	) {
		const token = config.get('FILE_ACCESS_TOKEN', { infer: true });
		super(client, AVATAR_SERVICE_NAME, token);
	}
}
