import { Injectable, Logger } from '@nestjs/common';
import type { RmqContext } from '@nestjs/microservices';

@Injectable()
export class RmqServerService {
	private readonly logger = new Logger(RmqServerService.name);

	public ack(context: RmqContext): void {
		const channel = context.getChannelRef();
		const msg = context.getMessage();
		const tag = msg?.fields?.deliveryTag;

		if (!tag) return;

		channel.ack(msg);

		this.logger.debug(
			`ACK (pattern: ${context.getPattern()}, tag: ${tag})`
		);
	}

	public nack(context: RmqContext, requeue = false): void {
		const channel = context.getChannelRef();
		const msg = context.getMessage();
		const tag = msg?.fields?.deliveryTag;

		if (!tag) return;

		channel.nack(msg, false, requeue);

		return requeue
			? this.logger.warn(
					`NACK response (pattern: ${context.getPattern()}, tag: ${tag})`
				)
			: this.logger.error(
					`NACK drop (pattern: ${context.getPattern()}, tag: ${tag})`
				);
	}
}
