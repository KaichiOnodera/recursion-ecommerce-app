import { Response } from 'express';
import { AuthenticatedRequest } from 'src/middlewares';
import { OrderConfirmationInteractor } from '../interactors/OrderConfirmationInteractor';

export class OrderConfirmationController {
  constructor(
    private orderConfirmationInteractor: OrderConfirmationInteractor,
  ) {}
  async execute(req: AuthenticatedRequest, res: Response) {
    const { to, orderId } = req.body;

    if (!to || !orderId) {
      return res
        .status(400)
        .json({ message: 'Missing "to" or "orderId" in request body' });
    }

    try {
      await this.orderConfirmationInteractor.OrderConfirmation(to, orderId);
      res
        .status(200)
        .json({ message: 'Delivery notification email sent successfully' });
    } catch (error) {
      console.error('Error in sendOrderConfirmation:', error);
      res
        .status(500)
        .json({ message: 'Failed to send order confirmation email' });
    }
  }
}
