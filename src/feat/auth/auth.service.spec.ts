/**Логика каждого теста строится по паттерну AAA:
Arrange — подготавливаем моки и данные
Act — вызываем тестируемый метод
Assert — проверяем результат через expect */
import { BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
	HASH_SERVICE,
	JWT_PASSPORT_SERVICE,
	OTP_SERVICE,
	SESSION_SERVICE,
	UserRepository
} from 'src/core';
import { OtpKey } from 'src/shared';
import 'test/__mocks__/prisma.mock';

import { AuthService } from './auth.service';

// моки
const mockUserRepo = {
	findAccountByEmailOrUsername: jest.fn(),
	createAccount: jest.fn(),
	findAccount: jest.fn(),
	updateAccount: jest.fn()
};

const mockHashService = {
	hash: jest.fn(),
	verify: jest.fn()
};

const mockOtpService = {
	generate: jest.fn(),
	verify: jest.fn()
};

const mockJwtService = {
	signTokens: jest.fn(),
	verify: jest.fn()
};

const mockSessionService = {
	set: jest.fn(),
	get: jest.fn(),
	delete: jest.fn()
};

const mockConfigService = {
	get: jest.fn((key: string) => {
		const config: Record<string, string> = {
			COOKIE_DOMAIN: 'localhost',
			NODE_ENV: 'development'
		};
		return config[key];
	})
};

describe('AuthService', () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: HASH_SERVICE, useValue: mockHashService },
				{ provide: OTP_SERVICE, useValue: mockOtpService },
				{ provide: JWT_PASSPORT_SERVICE, useValue: mockJwtService },
				{ provide: SESSION_SERVICE, useValue: mockSessionService },
				{ provide: ConfigService, useValue: mockConfigService },
				{ provide: UserRepository, useValue: mockUserRepo }
			]
		}).compile();
		service = module.get<AuthService>(AuthService);
	});

	afterEach(() => jest.clearAllMocks());

	describe('register', () => {
		const dto = {
			username: 'TestUser1',
			email: 'test@test.com',
			password: 'Test1!pass'
		};

		it('должен выбросить ConflictException если аккаунт уже существует', async () => {
			// акк существует
			mockUserRepo.findAccountByEmailOrUsername.mockResolvedValue({
				id: 'uuid',
				email: dto.email,
				username: dto.username
			});

			// ошибка выброшена
			await expect(service.register(dto)).rejects.toThrow(
				ConflictException
			);
		});

		it('должен создать аккаунт и вернуть OTP код если аккаунт не существует', async () => {
			// возращает null - аккаунта нет
			mockUserRepo.findAccountByEmailOrUsername.mockResolvedValue(null);
			// hash вернёт хеш пароля
			mockHashService.hash.mockResolvedValue('hashed_password');
			// createAccount вернёт id нового аккаунта
			mockUserRepo.createAccount.mockResolvedValue('new-uuid');
			// generate вернёт OTP код
			mockOtpService.generate.mockResolvedValue({ code: '123456' });

			const result = await service.register(dto);

			expect(
				mockUserRepo.findAccountByEmailOrUsername
			).toHaveBeenCalledWith(dto.email, dto.username);
			expect(mockHashService.hash).toHaveBeenCalledWith(dto.password);
			expect(mockUserRepo.createAccount).toHaveBeenCalledWith({
				email: dto.email,
				username: dto.username,
				password: 'hashed_password'
			});
			expect(mockOtpService.generate).toHaveBeenCalledWith(
				'new-uuid',
				OtpKey.EMAIL
			);
			expect(result).toEqual({ code: '123456' });
		});

		it('не должен создавать аккаунт если уже существует', async () => {
			// если вернет данные аккаунта
			mockUserRepo.findAccountByEmailOrUsername.mockResolvedValue({
				id: 'uuid'
			});

			try {
				await service.register(dto);
			} catch {}

			expect(mockUserRepo.createAccount).not.toHaveBeenCalled();
		});
	});

	describe('resend', () => {
		const dto = {
			email: 'email@test.com'
		};

		it('должен выбросить BadRequestException, если пользователя нет', async () => {
			mockUserRepo.findAccount.mockResolvedValue(null);

			await expect(service.resend(dto)).rejects.toThrow(
				BadRequestException
			);
		});

		it('должен выбросить BadRequestException, если аккаунт верифицирован', async () => {
			mockUserRepo.findAccount.mockResolvedValue({
				id: 'uuid',
				isVerified: true
			});

			await expect(service.resend(dto)).rejects.toThrow(
				BadRequestException
			);
		});

		it('должен выбросить BadRequestException, если аккаунт удален', async () => {
			mockUserRepo.findAccount.mockResolvedValue({
				id: 'uuid',
				deletedAt: new Date()
			});

			await expect(service.resend(dto)).rejects.toThrow(
				BadRequestException
			);
		});

		it('должен перевыпустить ОТП код', async () => {
			mockUserRepo.findAccount.mockResolvedValue({
				id: 'uuid',
				isVerified: false,
				deletedAt: null
			});

			mockOtpService.generate.mockResolvedValue({ code: '123456' });

			const result = await service.resend(dto);

			expect(mockUserRepo.findAccount).toHaveBeenCalledWith({
				email: dto.email
			});
			expect(mockOtpService.generate).toHaveBeenCalledWith(
				'uuid',
				OtpKey.EMAIL
			);
			expect(result).toEqual({ code: '123456' });
		});
	});
});
