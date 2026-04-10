import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TransactionRepository } from '@transaction-service/src/core';
import { YookassaService, type YookassaWebhookResponse } from 'libsV2/payments';

@Injectable()
export class YookassaWebhookService {
	private readonly logger = new Logger(YookassaWebhookService.name);

	public constructor(
		private readonly txRepo: TransactionRepository,
		private readonly yookassaService: YookassaService
	) {}

	public async processing(data: YookassaWebhookResponse) {
		const { event, object } = data;

		this.logger.log(`Событие "${event}" | paymentId=${object.id}`);

		switch (event) {
			case 'payment.succeeded':
				return this.succeeded(object.id);
			case 'payment.canceled':
				return this.canceled(object.id);
			default:
				this.logger.warn(`Неизвестное событие "${event}"`, data);
				return;
		}
	}

	private async succeeded(paymentId: string) {
		// проверяем существование платежа в Yookassa
		// проверяем что он действительно успешен

		// если клоун создал платеж и надеется что зашлет типо оплатил - засылаем ему оишбку
		// если юкасса заслала что человек оплатил но по факту нет (или человек оплатил но данные у юкассы не обновились) пускай ретраит

		// падает в retry -> если клоун балуется поулчит ошибку потому что в юкассе вообще нет такого платежа
		// если это юкасса заслала херню но человек оплатил пускай ретраит
		const payment = await this.yookassaService
			.checkPaymentStatus(paymentId, 'succeeded')
			.catch(error => {
				this.logger.error(
					`Ошибка получения данных по платежу "${paymentId}"`,
					error
				);
				throw new BadRequestException();
			});

		this.logger.log(`Платеж "${payment.id}" верифицирован`);

		// обновляем статус транзакции -> COMPLETED и создаем событие в outbox
		// если бд упала-> retry для юкассы
		// если транзакция по providerPaymentId не найдена -> это жопа (по факту мой баг)
		const tx = await this.txRepo
			.setStatusCompletedAndCreateOutboxEvent(payment.id)
			.catch(error => {
				this.logger.error(
					`Ошибка обновления статуса транзакции -> "${tx.status}" и создания outbox event "${tx.topic}" | paymentId=${payment.id}`,
					error
				);
				throw new BadRequestException();
			});

		this.logger.log(
			`[${tx.id}] Транзакция -> "${tx.status}"`,
			`[${tx.eventId}] Создан outbox event с топиком "${tx.topic}"`
		);
	}

	public async canceled(paymentId: string) {
		const payment = await this.yookassaService
			.checkPaymentStatus(paymentId, 'canceled')
			.catch(error => {
				this.logger.error(
					`Ошибка получения данных по платежу "${paymentId}"`,
					error
				);
				throw new BadRequestException();
			});

		this.logger.log(`Платеж "${payment.id}" отменен`);

		const tx = await this.txRepo
			.setStatusTimeout(paymentId)
			.catch(error => {
				this.logger.error(
					`Ошибка обновления статуса транзакции -> "${tx.status}" | paymentId=${payment.id}`,
					error
				);
				throw new BadRequestException();
			});

		this.logger.log(`[${tx.id}] Транзакция -> "${tx.status}"`);
	}
}
