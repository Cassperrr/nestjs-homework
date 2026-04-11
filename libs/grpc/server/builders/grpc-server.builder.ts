import { type INestApplication, Logger } from '@nestjs/common';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GRPC_CLIENTS } from 'registries';

/**
 * Builder для создания сервера gRPC. Зависит от реестра клиентов.
 * @param app Nest приложение
 * @param url gRPC url
 * @param clients Типизирвоанный список ключей клиентов из реестра
 */
export function createGrpcServer(
	app: INestApplication,
	url: string,
	clients: Array<keyof typeof GRPC_CLIENTS>
) {
	const packages = clients.map(client => GRPC_CLIENTS[client].package);
	const protoPaths = clients.map(client => GRPC_CLIENTS[client].protoPath);

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
	const logger = new Logger('GRPC Server Builder');
	logger.warn(`Сервер gRPC с пакетами "${packages.toString()}" запущен`);
}
