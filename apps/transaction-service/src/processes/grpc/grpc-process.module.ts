import { Module } from '@nestjs/common';

import { GrpcProcessController } from './grpc-process.controller';
import { GrpcProcessService } from './grpc-process.service';

@Module({
	controllers: [GrpcProcessController],
	providers: [GrpcProcessService],
	exports: [GrpcProcessService]
})
export class GrpcProcessModule {}
