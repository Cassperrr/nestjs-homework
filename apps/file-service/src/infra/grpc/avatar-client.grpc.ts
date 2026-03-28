import { AbstractGrpcClient, InjectGrpcClient } from '@libs/grpc';
import { Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	AVATAR_PACKAGE_NAME,
	AVATAR_SERVICE_NAME,
	AvatarServiceClient
} from 'contracts/gen/avatar';

@Injectable()
export class AvatarClientGrpc extends AbstractGrpcClient<AvatarServiceClient> {
	public constructor(
		@InjectGrpcClient(AVATAR_PACKAGE_NAME) client: ClientGrpc
	) {
		super(client, AVATAR_SERVICE_NAME);
	}
}
