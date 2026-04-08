import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
	type OnGatewayConnection,
	type OnGatewayDisconnect,
	type OnGatewayInit,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import type { KafkaTopic, TransferCompletedEvent } from 'libs/kafka';
import type { JwtPayload } from 'shared';
import type { Server, Socket } from 'socket.io';

import { WssService } from './wss.service';

@WebSocketGateway()
export class WssGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;

	private readonly logger = new Logger(WssGateway.name);

	public constructor(
		private readonly wssService: WssService,
		private readonly jwtService: JwtService
	) {}

	public afterInit() {
		this.logger.log(`Wss server inited`);
	}

	public async handleConnection(client: Socket) {
		this.logger.log(`[${client.id}] Client connected`);

		// const { sockets } = this.server.sockets;
		const token = client.handshake.headers.authorization;

		if (!token) {
			this.logger.warn(`[${client.id}] Token missing`);
			client.emit('error', { message: 'Token missing', code: 401 });
			client.disconnect();
			return;
		}

		try {
			const payload: JwtPayload =
				await this.jwtService.verifyAsync(token);
			client.data.user = payload;
			const room = `room:${payload.id}`;
			await client.join(room);
			this.logger.log(
				`[${client.id}] User "${payload.id}" joined to room`
			);

			const delay = payload.exp * 1000 - Date.now();
			if (delay > 0) {
				setTimeout(() => {
					client.disconnect();
				}, delay);
			} else {
				client.disconnect();
			}
		} catch (error) {
			this.logger.warn(`[${client.id}] Token invalid`);
			client.emit('error', { message: 'Token invalid', code: 401 });
			client.disconnect();
			return;
		}
	}

	public handleDisconnect(client: Socket) {
		this.logger.log(`[${client.id}] Client disconnected`);
	}

	public sendNotification(
		accountId: string,
		event: string,
		payload: TransferCompletedEvent
	) {
		this.server.to(`room:${accountId}`).emit(event, payload);
		this.logger.log(`[${event}] [room:${accountId}] Message sent`);
	}
}
