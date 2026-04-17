import { Module } from '@nestjs/common';

import { ConfigModule } from './config';
import { CoreModule } from './core';
import { InfraModule } from './infra';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { BalanceResetProcessor, BalanceResetService } from './jobs';

@Module({
	imports: [ConfigModule, InfraModule, CoreModule],
	controllers: [JobController],
	providers: [JobService, BalanceResetService, BalanceResetProcessor]
})
export class JobModule {}
