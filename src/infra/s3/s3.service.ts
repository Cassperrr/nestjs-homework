import {
	DeleteObjectCommand,
	ListBucketsCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { RemoveFileException, UploadFileException } from 'src/common';
import { EnvTypes } from 'src/config';
import {
	IFileService,
	type IRemoveFilePayload,
	type IUploadFilePayload
} from 'src/shared';
import { uuidv7 } from 'uuidv7';

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

	public async uploadFile(
		payload: IUploadFilePayload
	): Promise<{ path: string }> {
		const { file, folder } = payload;
		const path = `${folder}/${uuidv7()}${extname(file.originalname)}`;

		this.logger.debug(
			`Beginning of uploading file to bucket. Path: ${path}`
		);

		try {
			await this.S3.send(
				new PutObjectCommand({
					Bucket: this.bucketName,
					Key: path,
					Body: file.buffer,
					ACL: 'public-read',
					ContentType: file.mimetype
				})
			);

			this.logger.debug(`Uploading was successful. Path: ${path}`);

			return { path };
		} catch (e) {
			this.logger.error(`File upload error with path: ${path}`);

			throw new UploadFileException(
				e instanceof Error ? e.message : String(e)
			);
		}
	}

	public async removeFile(payload: IRemoveFilePayload): Promise<void> {
		const { path } = payload;

		this.logger.debug('Beginning of removing file from bucket');

		try {
			await this.S3.send(
				new DeleteObjectCommand({
					Bucket: this.bucketName,
					Key: path
				})
			);

			this.logger.debug('Removing was successful');
		} catch (error) {
			this.logger.error(`File remove error with path: ${path}`);

			throw new RemoveFileException(
				error instanceof Error ? error.message : String(error)
			);
		}
	}
}
