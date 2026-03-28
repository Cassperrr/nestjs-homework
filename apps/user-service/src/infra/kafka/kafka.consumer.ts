import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserServiceEnv } from '@user-service/src/config';
import { AvatarService } from '@user-service/src/feat/avatar/avatar.service';
import { EachMessagePayload } from 'kafkajs';
import {
	AbstractKafkaConsumerService,
	AvatarDeleteRequestedEvent,
	KafkaTopic,
	KafkaTopics
} from 'libs/kafka';

@Injectable()
export class KafkaConsumerService extends AbstractKafkaConsumerService {
	public constructor(
		config: ConfigService<UserServiceEnv, true>
		// private readonly avatarService: AvatarService
	) {
		super(
			{
				clientId: 'user-service',
				brokers: [config.get('KAFKA_BROKER', { infer: true })]
			},
			{
				groupId: 'user-service-group'
			}
		);
	}

	protected getTopics(): KafkaTopic[] {
		return [KafkaTopics.AVATAR_DELETE_REQUESTED];
	}

	protected async handleMessage(
		topic: KafkaTopic,
		payload: EachMessagePayload
	): Promise<void> {
		switch (topic) {
			case KafkaTopics.AVATAR_DELETE_REQUESTED: {
				const event =
					this.parseMessage<AvatarDeleteRequestedEvent>(payload);
				// await this.avatarService.handleAvatarDeleteRequested(event);
				break;
			}
		}
	}
}
