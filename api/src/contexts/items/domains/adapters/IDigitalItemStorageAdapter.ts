export interface IDigitalItemStorageAdapter {
  save(file: Buffer, filename: string, itemId: number): Promise<string>;
  delete(filePath: string, itemId: number): Promise<void>;
  getUrl(filePath: string, itemId: number): string;
}
