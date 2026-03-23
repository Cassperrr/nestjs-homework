import {
	BadRequestException,
	createParamDecorator,
	type ExecutionContext
} from '@nestjs/common';
import type { Request } from 'express';
import { validate } from 'uuid';

export const IdempotencyKey = createParamDecorator(
	(_: unknown, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest<Request>();

		const idempotencyKey = req.headers['idempotency-key'] as string;

		if (!idempotencyKey || !validate(idempotencyKey)) {
			throw new BadRequestException(
				'Idempotency-Key должен быть валидным UUID'
			);
		}

		return idempotencyKey;
	}
);
