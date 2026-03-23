export interface IUploadFilePayload {
	file: Express.Multer.File;
	folder: string;
}

export interface IRemoveFilePayload {
	path: string;
}

export abstract class AbstractFileService {
	abstract uploadFile(payload: IUploadFilePayload): Promise<{ path: string }>;
	abstract removeFile(payload: IRemoveFilePayload): Promise<void>;
}
