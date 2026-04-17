import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';

export const getLoggerOptions = (
	isDev: boolean
): NestApplicationContextOptions['logger'] => {
	return isDev
		? ['log', 'error', 'warn', 'debug', 'verbose']
		: ['log', 'error', 'warn'];
};
