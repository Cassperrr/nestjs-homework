import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { UnprocessableEntityException } from '@nestjs/common';
import { StorageEngine } from 'multer';
import { extname } from 'path';
import { uuidv7 } from 'uuidv7';

export class S3StreamStorage implements StorageEngine {
	// ==== зод все провалидирвоал на старте приложения, поэтому пох на кофиг сервис ====

	private readonly s3 = new S3Client({
		endpoint: process.env.MINIO_ENDPOINT,
		region: process.env.MINIO_REGION,
		credentials: {
			accessKeyId: process.env.MINIO_ACCESS_KEY as string,
			secretAccessKey: process.env.MINIO_SECRET_KEY as string
		},
		forcePathStyle: process.env.NODE_ENV === 'development',
		requestChecksumCalculation: 'WHEN_REQUIRED',
		responseChecksumValidation: 'WHEN_REQUIRED'
	});

	private readonly bucketName = process.env.MINIO_BUCKET_NAME as string;
	private readonly allowedMimeTypes = process.env
		.AVATAR_ALLOWED_TYPES as string;
	private readonly maxSizeMb = Number(process.env.AVATAR_MAX_SIZE_MB);

	public constructor(private readonly folder: string) {}

	public _handleFile(
		_req: Express.Request,
		file: Express.Multer.File,
		callback: (error?: any, info?: Partial<Express.Multer.File>) => void
	): void {
		if (!this.allowedMimeTypes.split('|').includes(file.mimetype))
			return callback(
				new UnprocessableEntityException(
					`Допустимые форматы: ${this.allowedMimeTypes}`
				)
			);

		const path = `${this.folder}/${uuidv7()}${extname(file.originalname)}`;

		let called = false;
		const done = (err?: any, info?: any) => {
			if (called) return;
			called = true;
			callback(err, info);
		};

		const upload = new Upload({
			client: this.s3,
			params: {
				Bucket: this.bucketName,
				Key: path,
				Body: file.stream,
				ACL: 'public-read',
				ContentType: file.mimetype
			}
		});

		let uploadedBytes = 0;
		file.stream.on('data', (chunk: Buffer) => {
			uploadedBytes += chunk.length;
			if (uploadedBytes > this.maxSizeMb * 1024 * 1024) {
				/* eslint-disable */
				upload.abort().finally(() => {
					file.stream.destroy(
						new UnprocessableEntityException(
							`Размер файла не должен превышать ${this.maxSizeMb} MB`
						)
					);
				});
			}
		});

		file.stream.on('error', err => done(err));

		upload
			.done()
			.then(() => done(null, { path } as any))
			.catch(err => done(err));
	}

	public _removeFile(
		_req: Express.Request,
		_file: Express.Multer.File,
		callback: (error: Error | null) => void
	) {
		callback(null);
	}
}
