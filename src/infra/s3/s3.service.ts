import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvTypes } from 'src/config';
import {
	IFileService,
	IRemoveFilePayload,
	IUploadFilePayload
} from 'src/shared';

@Injectable()
export class S3Service extends IFileService implements OnModuleInit {
	private readonly logger = new Logger(S3Service.name);
	private readonly S3: S3Client;
	private readonly bucketName: string;

	public constructor(private readonly cfg: ConfigService<EnvTypes, true>) {
		super();

		this.bucketName = this.cfg.get('MINIO_BUCKET_NAME', { infer: true });

		this.S3 = new S3Client({
			endpoint: cfg.get('MINIO_ENDPOINT', { infer: true }),
			region: cfg.get('MINIO_REGION', { infer: true }),
			credentials: {
				accessKeyId: cfg.get('MINIO_ACCESS_KEY', { infer: true }),
				secretAccessKey: cfg.get('MINIO_SECRET_KEY', { infer: true })
			},
			forcePathStyle:
				cfg.get('NODE_ENV', { infer: true }) === 'development'
		});

		this.logger.debug(`${S3Service.name} created`);
	}

	public async onModuleInit() {
		this.logger.log('S3 connecting...');
		try {
			await this.S3.send(new ListBucketsCommand({}));
			this.logger.log('S3 connection successful');
		} catch {
			throw new Error('S3 connection failed');
		}
	}
	// public async uploadFile(
	// 	payload: IUploadFilePayload
	// ): Promise<{ path: string }> {}
	// public async removeFile(payload: IRemoveFilePayload): Promise<void> {}
}
