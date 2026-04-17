import { Module } from '@nestjs/common';

import { FileClientProxy } from './file-client.proxy';

@Module({
	providers: [FileClientProxy],
	exports: [FileClientProxy]
})
export class ProxyClientsModule {}
