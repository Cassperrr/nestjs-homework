import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { YookassaFactoryModule } from 'libs/payments/yookassa';

import { TxServiceEnv } from '../../config';

@Module({
	imports: [
		YookassaFactoryModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<TxServiceEnv, true>) => ({
				shopId: config.get('YOOKASSA_SHOP_ID', { infer: true }),
				secretKey: config.get('YOOKASSA_SECRET_KEY', { infer: true })
			})
		})
	]
})
export class YookassaIntegrateModule {}
