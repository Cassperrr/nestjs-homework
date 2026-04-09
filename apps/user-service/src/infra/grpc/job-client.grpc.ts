import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import type { UserServiceEnv } from '@user-service/src/config';
import {
	JOB_SERVICE_NAME,
	type JobServiceClient
} from 'contracts/grpc/gen/job';
import { AbstractGrpcClient, InjectGrpcClient } from 'libsV2/grpc';

@Injectable()
export class JobClientGrpc extends AbstractGrpcClient<JobServiceClient> {
	public constructor(
		@InjectGrpcClient('JOB') client: ClientGrpc,
		private readonly config: ConfigService<UserServiceEnv, true>
	) {
		const token = config.get('USER_ACCESS_TOKEN', { infer: true });
		super(client, JOB_SERVICE_NAME, token);
	}
}
