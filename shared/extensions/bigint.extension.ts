declare global {
	interface BigInt {
		toDollarsStr(): string;
		toDollarsInt(): number;
	}
}

BigInt.prototype.toDollarsStr = function (): string {
	const value = BigInt(this.toString());
	const abs = value < 0n ? -value : value;
	const whole = abs / 100n;
	const remainder = abs % 100n;
	const result =
		remainder === 0n
			? whole.toString()
			: `${whole}.${remainder.toString().padStart(2, '0')}`;
	return value < 0n ? `-${result}` : result;
};

BigInt.prototype.toDollarsInt = function (): number {
	const value = BigInt(this.toString());
	const abs = value < 0n ? -value : value;
	const whole = abs / 100n;
	const remainder = abs % 100n;
	const result =
		remainder === 0n
			? whole.toString()
			: `${whole}.${remainder.toString().padStart(2, '0')}`;
	const str = value < 0n ? `-${result}` : result;
	return parseFloat(str);
};
