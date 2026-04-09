import { ModuleMetadata } from '@nestjs/common';

export interface YookassaModuleOptions {
	shopId: string;
	secretKey: string;
}

export interface YookassaModuleAsyncOptions extends Pick<
	ModuleMetadata,
	'imports'
> {
	imports?: any[];
	inject?: any[];
	useFactory: (
		...args: any[]
	) => YookassaModuleOptions | Promise<YookassaModuleOptions>;
}
