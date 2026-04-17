import z from 'zod';

/**
 *  Принимает схему - возращает validate ф-цию для ConfigModule
 */
export function createValidate<T extends z.ZodTypeAny>(schema: T) {
	return (config: Record<string, unknown>): Record<string, any> => {
		const result = schema.safeParse(config);

		if (!result.success)
			throw new Error(
				`ENV validation error:\n${result.error.issues
					.map(i => `${i.path.join('.')}: ${i.message}`)
					.join('\n')}`
			);

		return result.data as Record<string, any>;
	};
}
