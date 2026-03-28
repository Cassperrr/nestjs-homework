import { Module } from '@nestjs/common';

import { FileServiceProxyClient } from './file-service.proxy';

@Module({
	providers: [FileServiceProxyClient],
	exports: [FileServiceProxyClient]
})
export class ProxyModule {}
