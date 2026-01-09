import { Response, Request } from 'express';
import { ISendDownloadTokenInteractor } from '../usecases/ISendDownloadTokenInteractor';

export class SendDownloadTokenController {
  static execute: any;
  constructor(
    private sendDownloadTokenInteractor: ISendDownloadTokenInteractor,
  ) {}
  async execute(req: Request, res: Response): Promise<Response> {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    try {
      const result = await this.sendDownloadTokenInteractor.execute(
        Number(orderId),
      );
      return res.status(200).json({ success: result });
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
}
