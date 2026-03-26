import { PROTO_PATHS } from '@contracts';
import { createGrpcServer } from '@libs/grpc';
import { INestApplication } from '@nestjs/common';
import { JOB_PACKAGE_NAME } from 'contracts/gen/job';

export const grpcSetup = (app: INestApplication, grpcUrl: string) => {
	createGrpcServer(app, grpcUrl, [JOB_PACKAGE_NAME], [PROTO_PATHS.JOB]);
};
