import { Global, Module } from '@nestjs/common';

import { MongoModule } from './mongo';

@Global()
@Module({
	imports: [MongoModule],
	exports: [MongoModule]
})
export class InfraModule {}
