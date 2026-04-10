import { Global, Module } from '@nestjs/common';

import { RepositoriesModule } from '../repositories';

@Global()
@Module({
	imports: [RepositoriesModule],
	exports: [RepositoriesModule]
})
export class CoreModule {}
