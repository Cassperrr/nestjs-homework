export type YookassaCurrency = 'RUB';

export type YookassaConfirmationType = 'redirect';

export type YookassaPaymentMethodType = 'bank_card';

export type YookassaPaymentStatus =
	| 'pending'
	| 'waiting_for_capture'
	| 'succeeded'
	| 'canceled';

export type YookassaPaymentMethodStatus = 'inactive';

export type YookassaPaymentId = string;

export interface YookassaAmount {
	value: number;
	currency: YookassaCurrency;
}

export interface YookassaConfirmationRequest {
	type: YookassaConfirmationType;
	return_url: string;
}

export interface YookassaConfirmationResponse extends YookassaConfirmationRequest {
	confirmation_url: string;
}

export interface YookassaPaymentMethodData {
	type: YookassaPaymentMethodType;
}

export interface YookassaRecipient {
	account_id: string;
	gateway_id: string;
}

export interface YookassaMetadata {
	accountId: string;
	transactionId: string;
	[key: string]: string;
}

export interface CreatePaymentRequest {
	amount: YookassaAmount;
	description?: string;
	capture?: boolean;
	save_payment_method?: boolean;
	payment_method_data?: YookassaPaymentMethodData;
	confirmation?: YookassaConfirmationRequest;
	metadata?: YookassaMetadata;
	idempotencyKey: string;
}

export interface CreatePaymentResponse {
	id: YookassaPaymentId;
	status: YookassaPaymentStatus;
	amount: YookassaAmount;
	description: string;
	recipient: YookassaRecipient;
	payment_method: {
		type: YookassaPaymentMethodType;
		id: YookassaPaymentId;
		saved: boolean;
		status: YookassaPaymentMethodStatus;
	};
	created_at: Date;
	confirmation: YookassaConfirmationResponse;
	test: boolean;
	paid: boolean;
	refundable: boolean;
	metadata: YookassaMetadata;
}

export type YookassaWebhookType = 'notification';

export type YookassaWebhookEvent =
	| 'payment.succeeded'
	| 'payment.canceled'
	| 'payment.waiting_for_capture';

export interface YookassaPaymentCardResponse {
	first6: string;
	last4: string;
	expiry_year: string;
	expiry_month: string;
	card_type: string;
}

export interface YookassaPaymentObjectResponse {
	id: YookassaPaymentId;
	status: YookassaPaymentStatus;
	amount: YookassaAmount;
	income_amount: YookassaAmount;
	description: string;
	recipient: YookassaRecipient;
	payment_method: {
		type: YookassaPaymentMethodType;
		id: YookassaPaymentId;
		saved: boolean;
		status: YookassaPaymentMethodStatus;
		title: string;
		card: YookassaPaymentCardResponse;
	};
	captured_at: Date;
	created_at: Date;
	test: boolean;
	refunded_amount: YookassaAmount;
	paid: boolean;
	refundable: boolean;
	metadata: YookassaMetadata;
	authorization_details: {
		rrn: string;
		auth_code: string;
		three_d_secure: {
			applied: boolean;
			protocol: string;
			method_completed: boolean;
			challenge_completed: boolean;
		};
	};
}

export interface YookassaWebhookResponse {
	type: YookassaWebhookType;
	event: YookassaWebhookEvent;
	object: YookassaPaymentObjectResponse;
}
