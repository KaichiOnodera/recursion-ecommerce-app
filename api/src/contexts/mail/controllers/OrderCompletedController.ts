import { Response } from 'express';
import { AuthenticatedRequest } from 'src/middlewares';
import { IOrderCompletedInteractor } from '../usecases/IOrderCompletedInteractor';

export class OrderCompletedController {
  constructor(
    private readonly orderCompletedInteractor: IOrderCompletedInteractor,
  ) {}

  async execute(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        return res.status(400).json({ message: 'Missing orderId' });
      }

      await this.orderCompletedInteractor.OrderCompleted(orderId);

      return res
        .status(200)
        .json({ message: 'Order completed email sent successfully' });
    } catch (error: unknown) {
      console.error('Error sending order completed email:', error);

      const message = error instanceof Error ? error.message : 'Unknown error';

      if (message === 'Order not found' || message === 'User not found') {
        return res.status(404).json({ message });
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
