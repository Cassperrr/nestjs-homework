import { Controller, Inject, Logger, Type } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

export function createGrpcController<T>(
	serviceName: string,
	ServiceClass: new (...args: any[]) => T,
	proxingMethods: Array<keyof T> = [] // для явного прокисрования методов чтобы избежать мусора если он там появится
): Type<any> {
	const controllerName = `${ServiceClass.name.replace('Service', '')}Controller`;
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
	});

	Object.defineProperty(DynamicGrpcController, 'name', {
		value: controllerName
	});

	return DynamicGrpcController;
}
