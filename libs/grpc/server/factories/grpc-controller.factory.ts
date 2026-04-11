import {
	Controller,
	Inject,
	Logger,
	SetMetadata,
	type Type,
	UseGuards
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ALLOWED_SERVICES_KEY } from '../constants';
import { GrpcAuthGuard } from '../guard';

/**
 * Фабрика для создания упрощенного gRPC контроллера и проксирования методов сервиса в него
 * @param serviceName Название сервиса
 * @param ServiceClass Класс сервиса
 * @param proxingMethods Параметр для явного проксирования методов
 * @param acl Объект с ключом - название метода и значением - список access-токенов сервисов, 		которым разрешено обращаться в этот метод
 * @returns Возращает gRPC контроллер
 */
export function createGrpcController<T>(
	serviceName: string,
	ServiceClass: new (...args: any[]) => T,
	proxingMethods: Array<keyof T> = [],
	acl: Partial<Record<keyof T, string[]>> = {}
): Type<any> {
	const controllerName = `${serviceName.replace('Service', '')}Controller`;
	const logger = new Logger(`GrpcControllerFactory (${controllerName})`);

	// делаем обычный контроллер
	@Controller()
	class DynamicGrpcController {
		constructor(@Inject(ServiceClass) private readonly service: T) {}
	}

	// фиксируем DI metadata явно
	Reflect.defineMetadata(
		'design:paramtypes',
		[ServiceClass],
		DynamicGrpcController
	);

	// вешаем гвард на авторизицированные запросы между микросервисами
	UseGuards(GrpcAuthGuard)(DynamicGrpcController);

	// собираем методы сервиса в список
	const proto = ServiceClass.prototype;
	const methodsForProxing = (
		proxingMethods.length > 0
			? proxingMethods.map(String)
			: Object.getOwnPropertyNames(proto)
	).filter(m => {
		if (m === 'constructor') return false;
		if (m.startsWith('_')) return false;
		// исключаем lifecycle hooks NestJS
		if (
			[
				'onModuleInit',
				'onModuleDestroy',
				'onApplicationBootstrap'
			].includes(m)
		)
			return false;
		return true;
	});

	logger.debug(`Methods for proxing: ${methodsForProxing.toString()}`);

	// создаем ф-цию обертку
	methodsForProxing.forEach(method => {
		const originalDescriptor = Object.getOwnPropertyDescriptor(
			proto,
			method
		)!;
		const descriptor = {
			...originalDescriptor,
			value: function (this: any, data: any) {
				return this.service[method](data);
			}
		};

		// eslint-disable-next-line @typescript-eslint/unbound-method
		Object.defineProperty(descriptor.value, 'name', { value: method });

		// добавляем метод в класс
		Object.defineProperty(
			DynamicGrpcController.prototype,
			method,
			descriptor
		);

		// вешаем grpc декортор
		GrpcMethod(serviceName, method)(
			DynamicGrpcController.prototype,
			method,
			descriptor
		);

		const allowedServices = acl[method as keyof T];
		if (allowedServices) {
			SetMetadata(ALLOWED_SERVICES_KEY, allowedServices)(
				DynamicGrpcController.prototype,
				method,
				descriptor
			);
		}
	});

	Object.defineProperty(DynamicGrpcController, 'name', {
		value: controllerName
	});

	return DynamicGrpcController;
}
