import { Global, Module } from '@nestjs/common';

import { TransactionRepository } from './repositories';

@Global()
@Module({
	providers: [TransactionRepository],
	exports: [TransactionRepository]
})
export class CoreModule {}
