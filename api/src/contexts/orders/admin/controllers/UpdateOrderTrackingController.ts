import express from 'express';
import { IUpdateOrderTrackingInteractor } from '../usecases/IUpdateOrderTrackingInteractor';

export class UpdateOrderTrackingController {
  constructor(
    private readonly updateOrderTrackingInteractor: IUpdateOrderTrackingInteractor,
  ) {}

  async execute(
    req: express.Request<{ id: string }>,
    res: express.Response,
  ): Promise<void> {
    try {
      const orderId = parseInt(req.params.id, 10);
      const { trackingNumber } = req.body;

      if (isNaN(orderId)) {
        res.status(400).json({ error: 'Invalid order ID' });
        return;
      }

      if (!trackingNumber || typeof trackingNumber !== 'string') {
        res.status(400).json({ error: 'Tracking number is required' });
        return;
      }

      await this.updateOrderTrackingInteractor.execute(
        orderId,
        trackingNumber.trim(),
      );

      res.status(200).json({ message: 'Tracking number updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Order not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (
          error.message === 'This order does not contain physical items' ||
          error.message === 'This order has already been shipped' ||
          error.message === 'This order is not ready for shipping'
        ) {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      throw error;
    }
  }
}
