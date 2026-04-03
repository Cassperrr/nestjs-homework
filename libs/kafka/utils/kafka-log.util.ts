import type { Logger } from '@nestjs/common';
import { type LogEntry, logLevel } from 'kafkajs';

export const kafkaLog = (logger: Logger, entry: LogEntry): void => {
	const { level, log } = entry;
	const { message, ...rest } = log;
	const context = rest.broker ? `KafkaJS [${rest.broker}]` : 'KafkaJS';
	const meta = Object.keys(rest).length ? rest : undefined;

	switch (level) {
		case logLevel.ERROR:
			logger.error(message, meta, context);
			break;
		case logLevel.WARN:
			logger.warn(message, context);
			break;
		case logLevel.INFO:
			logger.log(message, context);
			break;
		case logLevel.DEBUG:
			logger.debug(message, context);
			break;
	}
};
