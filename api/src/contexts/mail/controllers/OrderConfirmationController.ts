import { Response } from 'express';
import { AuthenticatedRequest } from 'src/middlewares';
import { OrderConfirmationInteractor } from '../interactors/OrderConfirmationInteractor';

export class OrderConfirmationController {
  constructor(
    private orderConfirmationInteractor: OrderConfirmationInteractor,
  ) {}

  async execute(req: AuthenticatedRequest, res: Response) {
    const { cartId } = req.body;
    const userId = req.user?.userId;
    const email = req.user?.email;

    if (!userId || !cartId) {
      return res
        .status(400)
        .json({ message: 'Missing "cartId" or user not authenticated' });
    }

    await this.orderConfirmationInteractor.OrderConfirmation(
      String(email),
      String(cartId),
    );
    return res
      .status(200)
      .json({ message: 'Order Confirmation email sent successfully' });
  }
}
