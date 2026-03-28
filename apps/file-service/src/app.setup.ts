import { GrpcExeptionFilter } from '@libs/grpc';
import { INestApplication } from '@nestjs/common';

export const appSetup = (app: INestApplication, isDev: boolean) => {
	app.useGlobalFilters(new GrpcExeptionFilter());
};
