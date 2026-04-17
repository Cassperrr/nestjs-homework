import type { INestApplication } from '@nestjs/common';
import { createGrpcServer } from 'libs/grpc';

export const grpcSetup = (app: INestApplication, grpcUrl: string) => {
	createGrpcServer(app, grpcUrl, ['JOB']);
};
