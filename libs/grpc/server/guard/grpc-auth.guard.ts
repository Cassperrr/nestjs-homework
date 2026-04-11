import type { Metadata } from '@grpc/grpc-js';
import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	Logger
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { GrpcStatus } from 'libs/grpc';

import { ALLOWED_SERVICES_KEY } from '../constants';

/**
 * Guard для авторизированных запросов между gRPC-микросервисами
 */
@Injectable()
export class GrpcAuthGuard implements CanActivate {
	private readonly logger = new Logger(GrpcAuthGuard.name);

	public constructor(private reflector: Reflector) {}

	public canActivate(context: ExecutionContext): boolean {
		try {
			const allowedTokens = this.reflector.get<string[] | undefined>(
				ALLOWED_SERVICES_KEY,
				context.getHandler()
			);

			const methodName = context.getHandler().name;

			if (!allowedTokens) {
				throw Error(`[${methodName}] Не определен ACL метода`);
			}

			const metadata: Metadata = context.switchToRpc().getContext();
			const values = metadata.get('authorization');

			if (!values.length) {
				throw Error(
					`[${methodName}] Не предоставлен токен авторизации сервиса`
				);
			}

			const token = (values[0] as string).replace('Bearer ', '');

			if (!allowedTokens.includes(token)) {
				throw Error(
					`[${methodName}] Неверный токен авторизации сервиса`
				);
			}

			return true;
		} catch (e) {
			this.logger.error(
				`Несанкционированный запрос чужеродного сервиса. Отказ в исполнении. Проверьте API ключи.\nПричина: ${e instanceof Error ? e.message : String(e)}`
			);
			throw new RpcException({
				code: GrpcStatus.UNAUTHENTICATED,
				message: `Отказ в исполнении. Недостаточно прав сервиса. Причина: ${e instanceof Error ? e.message : String(e)}`
			});
		}
	}
}
