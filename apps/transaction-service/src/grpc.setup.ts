import { PROTO_PATHS } from '@contracts';
import { createGrpcServer } from '@libs/grpc';
import { INestApplication } from '@nestjs/common';
import { TRANSACTION_PACKAGE_NAME } from 'contracts/gen/transaction';

export const grpcSetup = (app: INestApplication, grpcUrl: string) => {
	createGrpcServer(
		app,
		grpcUrl,
		[TRANSACTION_PACKAGE_NAME],
		[PROTO_PATHS.TRANSACTION]
	);
};
