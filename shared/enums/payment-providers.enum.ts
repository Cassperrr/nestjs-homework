export const PaymentProvider = {
	YOOKASSA: 'YOOKASSA'
} as const;

export type PaymentProvider =
	(typeof PaymentProvider)[keyof typeof PaymentProvider];
