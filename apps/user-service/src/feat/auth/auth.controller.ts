import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import type { RegisterRequest, RegisterResponse } from 'contracts/gen/auth';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@GrpcMethod('AuthService')
	public async register(data: RegisterRequest): Promise<RegisterResponse> {
		return { code: '2324' };
	}
}
