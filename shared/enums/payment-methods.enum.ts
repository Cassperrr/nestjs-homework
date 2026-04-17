export const PaymentMethods = {
	YOOKASSA: {
		BANK_CARD: 'bank_card'
	}
} as const;

export type PaymentMethod =
	(typeof PaymentMethods)[keyof typeof PaymentMethods];
