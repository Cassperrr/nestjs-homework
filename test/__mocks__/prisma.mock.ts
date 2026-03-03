jest.mock('prisma/generated/client', () => ({
	PrismaClient: jest.fn().mockImplementation(() => ({})),
	Prisma: {
		PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {},
		PrismaClientUnknownRequestError: class PrismaClientUnknownRequestError extends Error {},
		PrismaClientValidationError: class PrismaClientValidationError extends Error {}
	},
	Role: { USER: 'USER', ADMIN: 'ADMIN' }
}));
