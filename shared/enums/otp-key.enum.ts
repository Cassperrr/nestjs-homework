export const OtpKey = {
	EMAIL: 'EMAIL',
	PASSWORD: 'PASSWORD'
} as const;

export type OtpKey = (typeof OtpKey)[keyof typeof OtpKey];
