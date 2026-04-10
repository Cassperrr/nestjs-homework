import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	Logger
} from '@nestjs/common';
import ipRangeCheck from 'ip-range-check';

@Injectable()
export class YookassaIpGuard implements CanActivate {
	private readonly logger = new Logger(YookassaIpGuard.name);
	private readonly allowedIps = [
		'185.71.76.0/27',
		'185.71.77.0/27',
		'77.75.153.0/25',
		'77.75.156.11',
		'77.75.156.35',
		'77.75.154.128/25',
		'2a02:5180::/32'
	];

	public canActivate(ctx: ExecutionContext): boolean {
		const req = ctx.switchToHttp().getRequest();
		const forwarded = req.headers['x-forwarded-for'];
		const ip =
			(Array.isArray(forwarded)
				? forwarded[0]
				: forwarded?.split(',')[0]
			)?.trim() ?? req.ip;
		const isAllowed = ipRangeCheck(ip, this.allowedIps);
		if (!isAllowed) this.logger.warn(`IP is not allowed: ${ip}`);
		return isAllowed;
	}
}
