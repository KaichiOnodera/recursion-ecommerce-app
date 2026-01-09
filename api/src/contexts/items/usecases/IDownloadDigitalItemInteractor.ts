export interface IDownloadDigitalItemInteractor {
  execute(token: string): Promise<{ storagePath: string; filename: string }>;
}
