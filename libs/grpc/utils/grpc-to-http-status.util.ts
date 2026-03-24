import { HttpStatus } from '@nestjs/common';

import { GrpcStatus } from './grpc-status.util';

export const grpcToHttpStatus: Record<number, number> = {
	[GrpcStatus.OK]: HttpStatus.OK,
	[GrpcStatus.CANCELLED]: 499,
	[GrpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
	[GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
	[GrpcStatus.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
	[GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
	[GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
	[GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
	[GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
	[GrpcStatus.FAILED_PRECONDITION]: HttpStatus.BAD_REQUEST,
	[GrpcStatus.ABORTED]: HttpStatus.CONFLICT,
	[GrpcStatus.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST,
	[GrpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
	[GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
	[GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
	[GrpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
	[GrpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED
};
