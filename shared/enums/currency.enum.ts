export const Currency = {
	RUB: 'RUB',
	USD: 'USD',
	USDT: 'USDT'
} as const;
export type Currency = (typeof Currency)[keyof typeof Currency];
