import type { INestApplication } from '@nestjs/common';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';

export function createGrpcServer(
	app: INestApplication,
	url: string,
	packages: string[],
	protoPaths: string[]
) {
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.GRPC,
		options: {
			package: packages,
			protoPath: protoPaths,
			url,
			loader: {
				keepCase: false,
				longs: String,
				enums: String,
				defaults: true,
				oneofs: true
			}
		}
	});
}
