export const RMQ_CLIENTS = {
	MAIL: {
		patterns: {
			otp_requested: 'otp.requested'
		},
		env: {
			url: 'RMQ_URL',
			queue: 'MAIL_QUEUE'
		}
	}
} as const;
