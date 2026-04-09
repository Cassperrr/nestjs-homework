import { INestApplication } from '@nestjs/common';
import { GrpcExeptionFilter } from 'libsV2/grpc';

export const appSetup = (app: INestApplication, isDev: boolean) => {
	app.useGlobalFilters(new GrpcExeptionFilter());
};
