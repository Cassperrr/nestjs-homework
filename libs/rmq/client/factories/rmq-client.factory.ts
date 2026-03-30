import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
	ClientProxyFactory,
	ClientRMQ,
	RmqOptions,
	Transport
} from '@nestjs/microservices';

@Injectable()
export class RmqClientFactory implements OnModuleDestroy {
	private clients = new Map<string, ClientRMQ>();
	private readonly logger = new Logger(RmqClientFactory.name);

	public async onModuleDestroy() {
		for (const [token, client] of this.clients.entries()) {
			try {
				await client.close();
				this.logger.log(`RMQ клиент "${token}" закрыт`);
			} catch (err) {
				this.logger.error(
					`Ошибка закрытия RMQ клиента "${token}"`,
					err
				);
			}
		}
		this.clients.clear();
	}

	public createClient(options: RmqOptions['options']) {
		return ClientProxyFactory.create({
			transport: Transport.RMQ,
			options
		}) as ClientRMQ;
	}

	public register(token: string, client: ClientRMQ) {
		if (this.clients.has(token)) {
			this.logger.warn(
				`RMQ клиент "${token}" уже зарегистрирован, перезапись`
			);
		}
		this.clients.set(token, client);
		this.logger.warn(`Пакет клиента RMQ "${token}" зарегистрирован`);
	}

	public getClient<T extends ClientRMQ = ClientRMQ>(token: string): T {
		const client = this.clients.get(token);

		if (!client)
			throw new Error(
				`[RMQ CLIENT FACTORY]: Rmq client "${token}" not found`
			);

		return client as T;
	}
}
