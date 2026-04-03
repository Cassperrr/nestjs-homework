import { RpcException } from '@nestjs/microservices';

export const rethrowGrpcError = (error: any): void => {
	if (error?.code !== undefined) {
		throw new RpcException({
			code: error.code,
			details: error.details ?? error.message
		});
	}
};
