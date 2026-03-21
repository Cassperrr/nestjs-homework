import { Module } from '@nestjs/common';

import { OTP_SERVICE } from '../constants';

import { OtpService } from './otp.service';

@Module({
	providers: [
		{
			provide: OTP_SERVICE,
			useClass: OtpService
		}
	],
	exports: [OTP_SERVICE]
})
export class OtpModule {}
