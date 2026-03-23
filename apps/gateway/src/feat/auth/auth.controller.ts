import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { ApiRegister } from './api';
import { AuthClientGrpc } from './auth.grpc';
import { RegisterRequest } from './dto';

@Controller('auth')
export class UserController {
	public constructor(private readonly client: AuthClientGrpc) {}

	@ApiRegister()
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	public async register(@Body() dto: RegisterRequest) {
		return this.client.call('register', dto);
	}
}
