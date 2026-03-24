import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
	HttpStatus,
	Logger
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import type { Response } from 'express';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(ThrottlerExceptionFilter.name);

	public catch(exception: ThrottlerException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		return response.status(HttpStatus.TOO_MANY_REQUESTS).json({
			statusCode: HttpStatus.TOO_MANY_REQUESTS,
			message: 'Слишком много запросов'
		});
	}
}
