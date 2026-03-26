import { AbstractGrpcClient, InjectGrpcClient } from '@libs/grpc';
import { Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
	JOB_PACKAGE_NAME,
	JOB_SERVICE_NAME,
	JobServiceClient
} from 'contracts/gen/job';

@Injectable()
export class JobClientGrpc extends AbstractGrpcClient<JobServiceClient> {
	public constructor(@InjectGrpcClient(JOB_PACKAGE_NAME) client: ClientGrpc) {
		super(client, JOB_SERVICE_NAME);
	}
}
