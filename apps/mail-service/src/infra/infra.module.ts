import { Global, Module } from '@nestjs/common';

import { SmtpModule } from './smtp';

@Global()
@Module({ imports: [SmtpModule], exports: [SmtpModule] })
export class InfraModule {}
