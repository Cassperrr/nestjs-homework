import { RolesGuard } from '@gateway/src/common';
import { Module } from '@nestjs/common';

import { JwtStrategy } from './jwt.strategy';

@Module({
	providers: [JwtStrategy, RolesGuard],
	exports: [JwtStrategy, RolesGuard]
})
export class StrategyModule {}
