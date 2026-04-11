import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationEnv } from '@notification-service/src/config';

import {
	TransactionDoc,
	TransactionDocSchema,
	TransactionDocService
} from './docs';

@Global()
@Module({
	imports: [
		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<NotificationEnv, true>) => ({
				uri: config.get('MONGO_URL', { infer: true })
			})
		}),
		MongooseModule.forFeature([
			{ name: TransactionDoc.name, schema: TransactionDocSchema }
		])
	],
	providers: [TransactionDocService],
	exports: [TransactionDocService]
})
export class MongoModule {}
