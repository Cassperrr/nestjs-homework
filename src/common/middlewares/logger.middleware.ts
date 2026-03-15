import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private readonly logger = new Logger('HTTP');

	use(req: Request, res: Response, next: NextFunction) {
		const ip = req.ip;
		const { method, originalUrl } = req;
		const start = process.hrtime.bigint();

		res.on('finish', () => {
			const duration =
				Number(process.hrtime.bigint() - start) / 1_000_000;
			this.logger.log(
				`[${ip}] ${method} ${originalUrl} ${res.statusCode} +${duration}ms`
			);
		});

		next();
	}
}
