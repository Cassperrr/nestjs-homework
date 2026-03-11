// == DI ==
export const HASH_SERVICE = Symbol('HASH_SERVICE');
export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
export const OTP_SERVICE = Symbol('OTP_SERVICE');
export const SESSION_SERVICE = Symbol('SESSION_SERVICE');
export const CACHE_SERVICE = Symbol('CACHE_SERVICE');

// == Cache ==
export const CACHE_EVENTS = {
	USERS_INVALIDATE: 'cache.users.invalidate'
} as const;

// == Queue ==
export enum QUEUE_EVENTS {
	BALANCE_RESET = 'balance-reset'
}
