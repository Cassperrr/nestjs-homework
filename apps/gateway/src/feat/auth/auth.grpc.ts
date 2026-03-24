import { AbstractGrpcClient, InjectGrpcClient } from '@libs/grpc';
import { Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	AUTH_PACKAGE_NAME,
	AUTH_SERVICE_NAME,
	AuthServiceClient
} from 'contracts/gen/auth';

@Injectable()
export class AuthClientGrpc extends AbstractGrpcClient<AuthServiceClient> {
	public constructor(
		@InjectGrpcClient(AUTH_PACKAGE_NAME) client: ClientGrpc
	) {
		super(client, AUTH_SERVICE_NAME);
	}
}
