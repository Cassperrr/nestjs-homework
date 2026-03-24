import { GrpcExeptionFilter } from '@libs/grpc';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { ThrottlerExceptionFilter } from './common';
import { swaggerSetup } from './swagger';

export function appSetup(app: INestApplication, isDev: boolean) {
	app.enableCors({
		origin: isDev ? true : 'оригин для прода', // TODO
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
	});

	app.use(cookieParser());

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true
		})
	);

	app.useGlobalFilters(
		new GrpcExeptionFilter(),
		new ThrottlerExceptionFilter()
	);

	// app.useGlobalFilters(new InfrastructureFilter());

	swaggerSetup(app, isDev);
}
