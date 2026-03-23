import { AbstractGrpcClient, InjectGrpcClient } from '@libs/grpc';
import { Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { AuthServiceClient } from 'contracts/gen/auth';

@Injectable()
export class AuthClientGrpc extends AbstractGrpcClient<AuthServiceClient> {
	public constructor(@InjectGrpcClient('AUTH_PACKAGE') client: ClientGrpc) {
		super(client, 'AuthService');
	}
}
