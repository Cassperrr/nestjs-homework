import { AbstractGrpcClient, InjectGrpcClient } from '@libs/grpc';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import { UserServiceEnv } from '@user-service/src/config';
import {
	JOB_PACKAGE_NAME,
	JOB_SERVICE_NAME,
	JobServiceClient
} from 'contracts/gen/job';

@Injectable()
export class JobClientGrpc extends AbstractGrpcClient<JobServiceClient> {
	public constructor(
		@InjectGrpcClient(JOB_PACKAGE_NAME) client: ClientGrpc,
		private readonly config: ConfigService<UserServiceEnv, true>
	) {
		const token = config.get('USER_ACCESS_TOKEN', { infer: true });
		super(client, JOB_SERVICE_NAME, token);
	}
}
