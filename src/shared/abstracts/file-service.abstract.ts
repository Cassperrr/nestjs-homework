export interface IUploadFilePayload {
	file: Express.Multer.File;
}

export interface IRemoveFilePayload {
	path: string;
}

export abstract class IFileService {
	// abstract uploadFile(payload: IUploadFilePayload): Promise<{ path: string }>;
	// abstract removeFile(payload: IRemoveFilePayload): Promise<void>;
}
