export interface IGetItemImageInteractor {
  execute(
    itemId: number,
    filename: string,
    isAdmin: boolean,
  ): Promise<{ buffer: Buffer; mimeType: string } | null>;
}
