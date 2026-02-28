import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerSetup = (app: INestApplication, isDev: boolean) => {
	const config = new DocumentBuilder()
		.setTitle('NestJs API Homework')
		.setVersion('1.0.0')
		.setDescription('Open API for review project')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('/docs', app, document, {
		swaggerOptions: {
			persistAuthorization: isDev // Ток дев
		}
	});
};
