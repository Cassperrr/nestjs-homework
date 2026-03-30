import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
	ClientGrpcProxy,
	ClientProxyFactory,
	GrpcOptions,
	Transport
} from '@nestjs/microservices';

@Injectable()
export class GrpcClientFactory implements OnModuleDestroy {
	private clients = new Map<string, ClientGrpcProxy>();
	private readonly logger = new Logger(GrpcClientFactory.name);

	public onModuleDestroy() {
		for (const [token, client] of this.clients.entries()) {
			try {
				client.close();
				this.logger.log(`gRPC клиент "${token}" закрыт`);
			} catch (err) {
				this.logger.error(
					`Ошибка закрытия gRPC клиента "${token}"`,
					err
				);
			}
		}
		this.clients.clear();
	}

	public createClient(options: GrpcOptions['options']) {
		return ClientProxyFactory.create({
			transport: Transport.GRPC,
			options
		});
	}

	public register(token: string, client: ClientGrpcProxy) {
		if (this.clients.has(token)) {
			this.logger.warn(
				`gRPC клиент "${token}" уже зарегистрирован, перезапись`
			);
		}
		this.clients.set(token, client);
		this.logger.warn(`Пакет клиента gRPC "${token}" зарегистрирован`);
	}

	public getClient<T extends ClientGrpcProxy = ClientGrpcProxy>(
		token: string
	): T {
		const client = this.clients.get(token);

		if (!client)
			throw new Error(
				`[GRPC CLIENT FACTORY]: Grpc client "${token}" not found`
			);

		return client as T;
	}
}
