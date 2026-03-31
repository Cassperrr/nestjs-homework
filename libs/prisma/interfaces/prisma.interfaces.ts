import { ModuleMetadata, Type } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

export interface PrismaModuleOptions {
	adapter: PrismaPg;
}

export interface PrismaModuleAsyncOptions extends Pick<
	ModuleMetadata,
	'imports'
> {
	imports?: any[];
	inject?: any[];
	useFactory: (
		...args: any[]
	) => PrismaModuleOptions | Promise<PrismaModuleOptions>;
}

export interface PrismaClientLike {
	$connect(): Promise<void>;
	$disconnect(): Promise<void>;
	$executeRawUnsafe(query: string): Promise<unknown>;
}

export type PrismaClientClass = new (args: {
	adapter: PrismaPg;
}) => PrismaClientLike;
