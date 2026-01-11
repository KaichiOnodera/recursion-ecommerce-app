import { Request, Response } from 'express';
import { DownloadDigitalItemInteractor } from '../interactors/DownloadDigitalItemInteractor';
import path from 'path';
import fs from 'fs';

export class DownloadDigitalItemController {
  constructor(
    private downloadDigitalItemInteractor: DownloadDigitalItemInteractor,
  ) {}
  async execute(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const { storagePath, filename } =
        await this.downloadDigitalItemInteractor.execute(token);

      const uploadDir = process.env.UPLOAD_DIR!;
      const fullPath = path.join(uploadDir, storagePath);

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );

      const stream = fs.createReadStream(fullPath);
      stream.on('error', () => res.status(404).send('File not found'));
      stream.pipe(res);
    } catch (e: any) {
      res.status(400).send(e.message ?? 'Download failed');
    }
  }
}
