import { LoginRequest, VerifyRequest } from '@gateway/src/feat/auth/dto';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
	AUTH_SERVICE_NAME,
	type RefreshRequest,
	type RegisterRequest,
	type ResendRequest,
	type TokensResponse
} from 'contracts/gen/auth';
import type { OtpCodeResponse, StringMessage } from 'contracts/gen/shared';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@GrpcMethod(AUTH_SERVICE_NAME)
	public async register(data: RegisterRequest): Promise<OtpCodeResponse> {
		return this.authService.register(data);
	}

	@GrpcMethod(AUTH_SERVICE_NAME)
	public async resend(data: ResendRequest): Promise<OtpCodeResponse> {
		return this.authService.resend(data);
	}

	@GrpcMethod(AUTH_SERVICE_NAME)
	public async verify(data: VerifyRequest): Promise<TokensResponse> {
		return this.authService.verify(data);
	}

	@GrpcMethod(AUTH_SERVICE_NAME)
	public async login(data: LoginRequest): Promise<TokensResponse> {
		return this.authService.login(data);
	}

	@GrpcMethod(AUTH_SERVICE_NAME)
	public async refresh(data: RefreshRequest): Promise<TokensResponse> {
		return this.authService.refresh(data);
	}

	@GrpcMethod(AUTH_SERVICE_NAME)
	public async logout(data: RefreshRequest): Promise<StringMessage> {
		return this.authService.logout(data);
	}
}
