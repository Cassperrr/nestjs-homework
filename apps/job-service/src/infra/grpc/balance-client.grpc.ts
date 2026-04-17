import type { JobServiceEnv } from '@job-service/src/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	BALANCE_SERVICE_NAME,
	type BalanceServiceClient
} from 'contracts/grpc/gen/balance';
import { AbstractGrpcClient, InjectGrpcClient } from 'libs/grpc';

@Injectable()
export class BalanceClientGrpc extends AbstractGrpcClient<BalanceServiceClient> {
	public constructor(
		@InjectGrpcClient('BALANCE') client: ClientGrpc,
		private readonly config: ConfigService<JobServiceEnv, true>
	) {
		const token = config.get('JOB_ACCESS_TOKEN', { infer: true });
		super(client, BALANCE_SERVICE_NAME, token);
	}
}
