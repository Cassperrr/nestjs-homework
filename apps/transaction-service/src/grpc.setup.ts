import type { INestApplication } from '@nestjs/common';
import { createGrpcServer } from 'libsV2/grpc';

export const grpcSetup = (app: INestApplication, grpcUrl: string) => {
	createGrpcServer(app, grpcUrl, ['TRANSACTION']);
};
