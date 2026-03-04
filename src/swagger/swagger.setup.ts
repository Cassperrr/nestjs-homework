import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import yaml from 'js-yaml';

export const swaggerSetup = (app: INestApplication, isDev: boolean) => {
	const configFile = fs.readFileSync('src/swagger/swagger.yml', 'utf8');

	const configYaml = yaml.load(configFile) as {
		title: string;
		version: string;
		description: string;
		path: string;
	};

	const builder = new DocumentBuilder()
		.setTitle(configYaml.title)
		.setVersion(configYaml.version)
		.setDescription(configYaml.description)
		.addBearerAuth();

	const document = SwaggerModule.createDocument(app, builder.build());

	SwaggerModule.setup(configYaml.path, app, document, {
		swaggerOptions: {
			persistAuthorization: isDev // Ток дев
		}
	});
};
