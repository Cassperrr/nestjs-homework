import { Module } from '@nestjs/common';
import { GrpcClientFactoryModule } from 'libsV2/grpc';

import { JobClientGrpc } from './job-client.grpc';

@Module({
	imports: [GrpcClientFactoryModule.registerAsync(['JOB'])],
	providers: [JobClientGrpc],
	exports: [JobClientGrpc]
})
export class GrpcClientsModule {}
