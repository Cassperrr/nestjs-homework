import type { JobServiceEnv } from '@job-service/src/config';
import { AbstractGrpcClient, InjectGrpcClient } from '@libs/grpc';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	BALANCE_PACKAGE_NAME,
	BALANCE_SERVICE_NAME,
	BalanceServiceClient
} from 'contracts/gen/balance';

@Injectable()
export class BalanceClientGrpc extends AbstractGrpcClient<BalanceServiceClient> {
	public constructor(
		@InjectGrpcClient(BALANCE_PACKAGE_NAME) client: ClientGrpc,
		private readonly config: ConfigService<JobServiceEnv, true>
	) {
		const token = config.get('JOB_ACCESS_TOKEN', { infer: true });
		super(client, BALANCE_SERVICE_NAME, token);
	}
}
