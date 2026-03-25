import { AbstractGrpcClient, InjectGrpcClient } from '@libs/grpc';
import { Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	PROFILE_PACKAGE_NAME,
	PROFILE_SERVICE_NAME,
	ProfileServiceClient
} from 'contracts/gen/profile';

@Injectable()
export class ProfileClientGrpc extends AbstractGrpcClient<ProfileServiceClient> {
	public constructor(
		@InjectGrpcClient(PROFILE_PACKAGE_NAME) client: ClientGrpc
	) {
		super(client, PROFILE_SERVICE_NAME);
	}
}
