import { createGrpcController } from '@libs/grpc';
import { JOB_SERVICE_NAME } from 'contracts/gen/job';

import { JobService } from './job.service';

const USER_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN as string;

export const JobController = createGrpcController(
	JOB_SERVICE_NAME,
	JobService,
	[],
	{
		putResetBalanceJob: [USER_ACCESS_TOKEN],
		startResetBalanceJob: [USER_ACCESS_TOKEN],
		stopResetBalanceJob: [USER_ACCESS_TOKEN]
	}
);
