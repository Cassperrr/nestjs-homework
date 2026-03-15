import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HASH_SERVICE, OTP_SERVICE, UserRepository } from 'src/core';
import { OtpKey } from 'src/shared';
import 'test/__mocks__/prisma.mock';

import { AccountService } from './account.service';

const mockUserRepo = {
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

describe('AccountService', () => {
	let service: AccountService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AccountService,
				{ provide: HASH_SERVICE, useValue: mockHashService },
				{ provide: OTP_SERVICE, useValue: mockOtpService },
				{ provide: UserRepository, useValue: mockUserRepo }
			]
		}).compile();
		service = module.get<AccountService>(AccountService);
	});

	afterEach(() => jest.clearAllMocks());

	describe('password/change', () => {
		const dto = {
			oldPassword: 'Test1!pass'
		};

		it('должен выбросить ошибку UnauthorizedException, если аккаунт НЕ существует', async () => {
			mockUserRepo.findAccount.mockResolvedValue(null);

			await expect(service.changePassword('uuid', dto)).rejects.toThrow(
				UnauthorizedException
			);
		});

		it('должен выбросить ошибку UnauthorizedException, если аккаунт удален', async () => {
			mockUserRepo.findAccount.mockResolvedValue({
				id: 'uuid',
				deletedAt: new Date()
			});

			await expect(service.changePassword('uuid', dto)).rejects.toThrow(
				UnauthorizedException
			);
		});

		it('должен выбросить ошибку UnauthorizedException, если пароли не совпадают', async () => {
			mockHashService.verify.mockResolvedValue(false);

			await expect(service.changePassword('uuid', dto)).rejects.toThrow(
				UnauthorizedException
			);
		});

		it('должен верифицировать пароль и вернуть OTP code, если пароль совпадает и аккаунт существует, и НЕ удален', async () => {
			mockUserRepo.findAccount.mockResolvedValue({
				id: 'uuid',
				deletedAt: null,
				password: 'hashed_password'
			});
			mockHashService.verify.mockResolvedValue(true);
			mockOtpService.generate.mockResolvedValue({ code: '123456' });

			const result = await service.changePassword('uuid', dto);

			expect(mockUserRepo.findAccount).toHaveBeenCalledWith({
				id: 'uuid'
			});
			expect(mockHashService.verify).toHaveBeenCalledWith(
				'hashed_password',
				dto.oldPassword
			);
			expect(mockOtpService.generate).toHaveBeenCalledWith(
				'uuid',
				OtpKey.PASSWORD
			);
			expect(result).toEqual({ code: '123456' });
		});
	});

	describe('password/confirm', () => {
		const dto = {
			newPassword: 'New!pass',
			code: '123456'
		};

		it('должен выбросить ошибку UnauthorizedException, если аккаунт НЕ существует', async () => {
			mockUserRepo.findAccount.mockResolvedValue(null);

			await expect(service.confirmPassword('uuid', dto)).rejects.toThrow(
				UnauthorizedException
			);
		});

		it('должен выбросить ошибку UnauthorizedException, если аккаунт удален', async () => {
			mockUserRepo.findAccount.mockResolvedValue({
				id: 'uuid',
				deletedAt: new Date()
			});

			await expect(service.confirmPassword('uuid', dto)).rejects.toThrow(
				UnauthorizedException
			);
		});

		it('должен пробросить ошибку от otpService.verify', async () => {
			mockUserRepo.findAccount.mockResolvedValue({
				id: 'uuid',
				deletedAt: null
			});
			mockOtpService.verify.mockRejectedValue(
				new UnauthorizedException('Неверный код')
			);

			await expect(service.confirmPassword('uuid', dto)).rejects.toThrow(
				UnauthorizedException
			);
		});

		it('должен обновить пароль и вернуть сообщение при успешной проверке', async () => {
			mockUserRepo.findAccount.mockResolvedValue({
				id: 'uuid',
				deletedAt: null
			});
			mockOtpService.verify.mockResolvedValue(undefined);
			mockHashService.hash.mockResolvedValue('hashed_new_password');

			const result = await service.confirmPassword('uuid', dto);

			expect(mockOtpService.verify).toHaveBeenCalledWith(
				'uuid',
				'123456',
				OtpKey.PASSWORD
			);
			expect(mockHashService.hash).toHaveBeenCalledWith('New!pass');
			expect(mockUserRepo.updateAccount).toHaveBeenCalledWith('uuid', {
				password: 'hashed_new_password'
			});
			expect(result).toEqual({ message: 'Пароль изменен' });
		});
	});

	describe('delete', () => {
		const mockRes = { clearCookie: jest.fn() };

		it('должен выбросить UnauthorizedException если пользователя нет', async () => {
			mockUserRepo.findAccount.mockResolvedValue(null);

			await expect(service.delete('uuid')).rejects.toThrow(
				UnauthorizedException
			);
		});

		it('должен выбросить UnauthorizedException если пользователь удалён', async () => {
			mockUserRepo.findAccount.mockResolvedValue({
				id: 'uuid',
				deletedAt: new Date()
			});

			await expect(service.delete('uuid')).rejects.toThrow(
				UnauthorizedException
			);
		});

		it('должен успешно удалить пользователя', async () => {
			const user = { id: 'uuid', deletedAt: null };
			mockUserRepo.findAccount.mockResolvedValue(user);
			mockUserRepo.updateAccount.mockResolvedValue(undefined);
			mockRes.clearCookie.mockReturnValue(undefined);

			const result = await service.delete('uuid');

			expect(mockUserRepo.updateAccount).toHaveBeenCalledWith(
				'uuid',
				expect.objectContaining({ deletedAt: expect.any(Date) })
			);
			expect(mockRes.clearCookie).toHaveBeenCalledWith('refreshToken');
			expect(result).toEqual({ message: 'Аккаунт удален' });
		});
	});
});
