export const RMQ_CLIENTS = {
	MAIL_CLIENT: {
		patterns: {
			otpRequested: 'otp.requested'
		},
		env: {
			url: 'RMQ_URL',
			queue: 'MAIL_QUEUE'
		}
	}
} as const;
