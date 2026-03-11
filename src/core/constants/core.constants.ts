// == DI ==
export const HASH_SERVICE = Symbol('HASH_SERVICE');
export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
export const OTP_SERVICE = Symbol('OTP_SERVICE');
export const SESSION_SERVICE = Symbol('SESSION_SERVICE');
export const CACHE_SERVICE = Symbol('CACHE_SERVICE');

// == Cache ==
export enum CACHE_EVENTS {
	USERS_INVALIDATE = 'cache.users.invalidate'
}

// == Queue ==
export enum QUEUES {
	BALANCE_RESET = 'balance-reset'
}

export enum JOBS {
	BALANCE_RESET_ALL = 'reset-all'
}
