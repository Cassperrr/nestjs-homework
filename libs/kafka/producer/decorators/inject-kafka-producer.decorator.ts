import { Inject } from '@nestjs/common';

import { KAFKA_PRODUCER } from '../constants';

export const InjectKafkaProducer = () => Inject(KAFKA_PRODUCER);
