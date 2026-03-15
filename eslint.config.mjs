// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'eslint.config.mjs',
			'prettier.config.mjs',
			'node_modules/**',
			'dist/**'
		]
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest
			},
			sourceType: 'commonjs',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		rules: {
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/no-explicit-any': 'warn', // Разрешён any везде
			'@typescript-eslint/no-floating-promises': 'warn', // Предупреждает о необработанных промисах
			'@typescript-eslint/no-unsafe-argument': 'off', // Предупреждение при передаче any в функции
			'@typescript-eslint/no-redundant-type-constituents': 'off', // Отключено из-за ReplyError проблемы
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unused-vars': [
				// Не использованные переменные
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'no-console': 'warn',
			'prettier/prettier': ['error', { endOfLine: 'auto' }]
		}
	},
	{
		files: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-explicit-any': 'off'
		}
	}
);
