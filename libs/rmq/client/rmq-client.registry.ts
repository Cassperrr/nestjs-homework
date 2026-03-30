export const RMQ_CLIENTS = {
	MAIL_CLIENT: {
		patterns: {
			'otp.requested': 'otp.requested'
		},
		env: {
			url: 'RMQ_URL',
			queue: 'MAIL_QUEUE'
		}
	}
} as const;
