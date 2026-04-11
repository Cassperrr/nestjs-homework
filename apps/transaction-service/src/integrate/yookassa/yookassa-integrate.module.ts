import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TxServiceEnv } from '@transaction-service/src/config';
import { YookassaFactoryModule } from 'libs/payments';

@Module({
	imports: [
		YookassaFactoryModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<TxServiceEnv, true>) => ({
				shopId: config.get('YOOKASSA_SHOP_ID', { infer: true }),
				secretKey: config.get('YOOKASSA_SECRET_KEY', { infer: true })
			})
		})
	]
})
export class YookassaIntegrateModule {}
