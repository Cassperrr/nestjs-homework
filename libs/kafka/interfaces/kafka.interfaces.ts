import type { ModuleMetadata, Type } from '@nestjs/common';
import type { ConsumerConfig, KafkaConfig, ProducerConfig } from 'kafkajs';

export interface KafkaMessage<T = unknown> {
	key?: string;
	value: T;
}

export interface KafkaConfigOptions {
	kafkaConfig: KafkaConfig;
}

export interface KafkaProducerModuleOptions extends KafkaConfigOptions {
	producerConfig?: ProducerConfig;
}

export interface KafkaConsumerModuleOptions extends KafkaConfigOptions {
	consumerConfig: ConsumerConfig;
}

export interface KafkaProducerModuleAsyncOptions extends Pick<
	ModuleMetadata,
	'imports'
> {
	imports?: any[];
	inject?: any[];
	useFactory: (
		...args: any[]
	) => KafkaProducerModuleOptions | Promise<KafkaProducerModuleOptions>;
}

export interface KafkaConsumerModuleAsyncOptions extends Pick<
	ModuleMetadata,
	'imports'
> {
	imports?: any[];
	inject?: any[];
	useFactory: (
		...args: any[]
	) => KafkaConsumerModuleOptions | Promise<KafkaConsumerModuleOptions>;
}
