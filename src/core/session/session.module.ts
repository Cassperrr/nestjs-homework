import { Module } from '@nestjs/common';

import { SESSION_SERVICE } from '../constants';

import { SessionService } from './session.service';

@Module({
	providers: [
		{
			provide: SESSION_SERVICE,
			useClass: SessionService
		}
	],
	exports: [SESSION_SERVICE]
})
export class SessionModule {}
