import { JOB_SERVICE_NAME } from 'contracts/grpc/gen/job';
import { createGrpcController } from 'libs/grpc';

import { ACCESS_LIST } from './config';
import { JobService } from './job.service';

export const JobController = createGrpcController(
	JOB_SERVICE_NAME,
	JobService,
	[],
	{
		putResetBalanceJob: [ACCESS_LIST.user_service],
		startResetBalanceJob: [ACCESS_LIST.user_service],
		stopResetBalanceJob: [ACCESS_LIST.user_service]
	}
);
