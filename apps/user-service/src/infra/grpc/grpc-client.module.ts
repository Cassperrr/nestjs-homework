import { GrpcClientModule } from '@libs/grpc';
import { Module } from '@nestjs/common';
import { JOB_PACKAGE_NAME } from 'contracts/gen/job';

import { JobClientGrpc } from './job-client.grpc';

@Module({
	imports: [GrpcClientModule.register([JOB_PACKAGE_NAME])],
	providers: [JobClientGrpc],
	exports: [JobClientGrpc]
})
export class GrpcModule {}
