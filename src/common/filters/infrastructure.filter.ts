import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
	HttpStatus,
	Logger
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import type { Response } from 'express';
import { ReplyError } from 'ioredis';
import { Prisma } from 'prisma/generated/client';

@Catch(Prisma.PrismaClientKnownRequestError, ReplyError, ThrottlerException)
export class InfrastructureFilter implements ExceptionFilter {
	private readonly logger = new Logger(InfrastructureFilter.name);

	catch(
		exception:
			| Prisma.PrismaClientKnownRequestError
			| InstanceType<typeof ReplyError>
			| ThrottlerException,
		host: ArgumentsHost
	) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		if (exception instanceof ThrottlerException) {
			return response.status(HttpStatus.TOO_MANY_REQUESTS).json({
				statusCode: HttpStatus.TOO_MANY_REQUESTS,
				message: 'Слишком много запросов'
			});
		}

		if (exception instanceof Prisma.PrismaClientKnownRequestError) {
			this.logger.error(
				`Prisma error: [${exception.code}] ${exception.message}`,
				exception.stack
			);
			return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Ошибка базы данных'
			});
		}

		if (exception instanceof ReplyError) {
			this.logger.error(
				`Redis error: [${exception.name}] ${exception.message}`,
				exception.stack
			);
			return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Внутренняя ошибка сервера'
			});
		}
	}
}
