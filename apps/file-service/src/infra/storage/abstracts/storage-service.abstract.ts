export interface UploadFilePayload {
	file: Express.Multer.File;
	folder: string;
}

export interface RemoveFilePayload {
	path: string;
}

export abstract class AbstractStorageService {
	abstract uploadFile(payload: UploadFilePayload): Promise<{ path: string }>;
	abstract removeFile(payload: RemoveFilePayload): Promise<void>;
}
