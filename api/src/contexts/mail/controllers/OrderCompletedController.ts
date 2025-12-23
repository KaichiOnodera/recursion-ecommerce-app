import Express from 'express';
import { AuthenticatedRequest } from 'src/middlewares';
import { OrderCompletedInteractor } from '../interactors/OrderCompletedInteractor';

export class OrderCompletedController {
  constructor(
    private readonly orderCompletedInteractor: OrderCompletedInteractor,
  ) {}

  async execute(req: AuthenticatedRequest, res: Express.Response) {
    const { cartId } = req.body;
    const userId = req.user?.userId;
    const email = req.user?.email;

    if (!userId || !cartId) {
      return res
        .status(400)
        .json({ message: 'Missing "cartId" or user not authenticated' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Missing email' });
    }

    await this.orderCompletedInteractor.OrderCompleted(email, cartId);
    return res
      .status(200)
      .json({ message: 'Order Completed email sent successfully' });
  }
}
