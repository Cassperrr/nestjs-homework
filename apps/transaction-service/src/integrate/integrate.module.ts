import { Global, Module } from '@nestjs/common';

import { YookassaIntegrateModule } from './yookassa';

@Global()
@Module({
	imports: [YookassaIntegrateModule],
	exports: [YookassaIntegrateModule]
})
export class IntegrateModule {}
