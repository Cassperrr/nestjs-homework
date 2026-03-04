import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { InfrastructureFilter } from './common';
import { swaggerSetup } from './swagger';

export const appSetup = (app: INestApplication, isDev: boolean) => {
	app.enableCors({
		origin: isDev ? true : 'оригин для прода',
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

	app.useGlobalFilters(new InfrastructureFilter());

	swaggerSetup(app, isDev);
};
