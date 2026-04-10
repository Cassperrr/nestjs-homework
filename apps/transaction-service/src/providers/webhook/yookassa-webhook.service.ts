import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TransactionRepository } from '@transaction-service/src/repositories';
import { YookassaService, type YookassaWebhookResponse } from 'libsV2/payments';
import { TransactionStatus } from 'shared';

@Injectable()
export class YookassaWebhookService {
	private readonly logger = new Logger(YookassaWebhookService.name);

	public constructor(
		private readonly txRepo: TransactionRepository,
		private readonly yookassaService: YookassaService
	) {}

	public async processing(data: YookassaWebhookResponse) {
		const { event, object } = data;

		const providerPaymentId = object.id;

		this.logger.log(
			`Событие "${event}" | providerPaymentId=${providerPaymentId}`
		);

		switch (event) {
			case 'payment.succeeded':
				return this.succeeded(providerPaymentId);
			case 'payment.canceled':
				return this.canceled(providerPaymentId);
			case 'payment.waiting_for_capture':
			default:
				this.logger.warn(`Неизвестное событие`, data);
				return;
		}
	}

	private async succeeded(providerPaymentId: string) {
		// проверяем существование платежа в Yookassa
		const payment = await this.yookassaService
			.getPayment(providerPaymentId)
			.then(payment => {
				// проверяем что он действительно успешен
				if (payment.status !== 'succeeded')
					throw new BadRequestException(
						`Неожиданный статус платежа: ${payment.status}`
					);
				return payment;
				// если клоун создал платеж и надеется что зашлет типо оплатил - засылаем ему оишбку
				// если юкасса заслала что человек оплатил но по факту нет (или человек оплатил но данные у юкассы не обновились) пускай ретраит
			})
			.catch(error => {
				this.logger.error(
					`Ошибка получения данных по платежу | providerPaymentId=${providerPaymentId}`,
					error
				);
				throw new BadRequestException();
				// падает в retry -> если это клоун балуется поулчит ошибку потому что в юкассе вообще нет такого платежа
				// если это юкасса заслала херню но человек оплатил пускай ретраит);
			});

		// блокируем, проверяем обнволяем и записываем данные в transactions и outbox event
		await this.txRepo.setTxStatusCompleted(payment.id).catch(error => {
			this.logger.error(
				`Ошибка обновления статуса транзакции | providerPaymentId=${payment.id}`,
				error
			);
			throw new BadRequestException();
			// если бд упала-> retry для юкассы
			// если транзакция по providerPaymentId не найдена -> это жопа (по факту мой баг)
		});

		this.logger.log(
			`Статус -> "${TransactionStatus.COMPLETED}" | providerPaymentId=${payment.id}`
		);
	}

	private async canceled(providerPaymentId: string) {
		const payment = await this.yookassaService
			.getPayment(providerPaymentId)
			.then(payment => {
				if (payment.status !== 'canceled')
					throw new BadRequestException(
						`Неожиданный статус платежа: ${payment.status}`
					);
				return payment;
			})
			.catch(error => {
				this.logger.error(
					`Ошибка получения данных по платежу | providerPaymentId=${providerPaymentId}`,
					error
				);
				throw new BadRequestException();
			});

		await this.txRepo.updateByPaymentId(payment.id, {
			status: TransactionStatus.TIMEOUT
		});

		this.logger.log(
			`Статус -> "${TransactionStatus.TIMEOUT}" | providerPaymentId=${payment.id}`
		);
	}
}
