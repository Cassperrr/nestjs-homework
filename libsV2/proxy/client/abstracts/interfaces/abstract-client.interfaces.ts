import { ClientRequest, IncomingMessage } from 'http';

export type CircuitState = 'closed' | 'open' | 'half-open';
export type ProxyReqHandler = (
	proxyReq: ClientRequest,
	req: IncomingMessage
) => void;
