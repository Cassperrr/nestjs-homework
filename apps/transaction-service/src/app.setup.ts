import { INestApplication } from '@nestjs/common';

export const appSetup = (app: INestApplication, trustNumber: number) => {
	app.getHttpAdapter().getInstance().set('trust proxy', trustNumber);
};
