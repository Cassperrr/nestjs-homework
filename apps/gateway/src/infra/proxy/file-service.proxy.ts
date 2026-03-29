import { GatewayEnv } from '@gateway/src/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractProxyClient } from 'libs/proxy';
import { JwtPayload, X_ACCOUNT_ID, X_GATEWAY_ACCESS_TOKEN } from 'shared';

@Injectable()
export class FileServiceProxyClient extends AbstractProxyClient {
	public constructor(
		private readonly config: ConfigService<GatewayEnv, true>
	) {
		const host = config.get('FILE_SERVICE_HOST', { infer: true });
		const port = config.get('FILE_SERVICE_PORT', { infer: true });
		const failureThreshold = config.get('FAILURE_THRESHOLD', {
			infer: true
		});
		const resetAfterMs = config.get('RESET_AFTER_MS', { infer: true });
		const proxyTimeoutMs = config.get('PROXY_TIMEOUT_MS', { infer: true });
		const accessToken = config.get('GATEWAY_ACCESS_TOKEN', { infer: true });
		const url = `http://${host}:${port}`;
		super(
			'file-service',
			url,
			failureThreshold,
			resetAfterMs,
			proxyTimeoutMs,
			(proxyReq, req) => {
				const user = req.user as JwtPayload;
				proxyReq.setHeader(X_ACCOUNT_ID, user.id);
				proxyReq.setHeader(X_GATEWAY_ACCESS_TOKEN, accessToken);
			}
		);
	}
}
