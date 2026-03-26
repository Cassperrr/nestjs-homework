import { createGrpcController } from '@libs/grpc';
import { JOB_SERVICE_NAME } from 'contracts/gen/job';

import { JobService } from './job.service';

export const JobController = createGrpcController(JOB_SERVICE_NAME, JobService);
