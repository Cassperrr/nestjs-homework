import { Injectable, Logger } from '@nestjs/common';
import {
	ClientGrpc,
	ClientProxyFactory,
	GrpcOptions,
	Transport
} from '@nestjs/microservices';

@Injectable()
export class GrpcClientFactory {
	private clients = new Map<string, ClientGrpc>();
	private readonly logger = new Logger(GrpcClientFactory.name);

	public createClient(options: GrpcOptions['options']) {
		return ClientProxyFactory.create({
			transport: Transport.GRPC,
			options
		}) as ClientGrpc;
	}

	public register(token: string, client: ClientGrpc) {
		this.clients.set(token, client);
		this.logger.warn(`Пакет клиента gRPC "${token}" зарегистрирован`);
	}

	public getClient<T extends ClientGrpc = ClientGrpc>(token: string): T {
		const client = this.clients.get(token);

		if (!client)
			throw new Error(
				`[GRPC CLIENT FACTORY]: Grpc client "${token}" not found`
			);

		return client as T;
	}
}
