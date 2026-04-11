import { INestApplication } from '@nestjs/common';
import { GrpcExeptionFilter } from 'libs/grpc';

export const appSetup = (app: INestApplication, isDev: boolean) => {
	app.useGlobalFilters(new GrpcExeptionFilter());
};
